import { OrderCreatedListener } from '../order-created'
import { natsWrapper } from '../../../nats-wrapper'
import { Ticket } from '../../../models/ticket'
import { OrderCreatedEvent, OrderStatus } from '@tickets-448800/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client)
  const ticket = Ticket.build({
    title: 'my new ticket',
    price: 1,
    userId: 'userId',
  })
  await ticket.save()
  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: 'my user',
    version: 0,
    expiresAt: new Date().toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
      version: 0,
    },
  }
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return {
    listener,
    msg,
    data,
    ticket,
  }
}

it('sets the user id of the ticket', async () => {
  const { listener, ticket, msg, data } = await setup()
  await listener.onMessage(data, msg)
  const updatedTicket = await Ticket.findById(ticket.id)
  expect(updatedTicket!.orderId).toEqual(data.id)
})

it('acknowledges the messages', async () => {
  const { listener, ticket, msg, data } = await setup()
  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})

it('publishes a ticket updated event', async () => {
  const { listener, ticket, data, msg } = await setup()
  await listener.onMessage(data, msg)
  expect(natsWrapper.client.publish).toHaveBeenCalled()
  const publisherArguments = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[2][1]
  )
  expect(publisherArguments.orderId).toEqual(data.id)
})

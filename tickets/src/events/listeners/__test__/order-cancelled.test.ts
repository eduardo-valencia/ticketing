import { OrderCancelledListener } from '../order-cancelled-listener'
import { natsWrapper } from '../../../nats-wrapper'
import mongoose from 'mongoose'
import { Ticket } from '../../../models/ticket'
import { Message } from 'node-nats-streaming'
import { OrderCancelledEvent } from '@tickets-448800/common'

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client)
  const orderId = mongoose.Types.ObjectId().toHexString()
  const ticket = Ticket.build({
    title: 'concert',
    price: 200,
    userId: 'my user id',
  })
  ticket.set({ orderId })
  await ticket.save()
  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  }
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }
  return { msg, data, ticket, orderId, listener }
}

it('updates the ticket', async () => {
  const { msg, data, ticket, orderId, listener } = await setup()
  await listener.onMessage(data, msg)
  const updatedTicket = await Ticket.findById(ticket.id)
  expect(updatedTicket!.orderId).not.toBeDefined()
})

it('acknowledges the event', async () => {
  const { msg, data, ticket, orderId, listener } = await setup()
  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})

it('calls the publish function', async () => {
  const { msg, data, ticket, orderId, listener } = await setup()
  await listener.onMessage(data, msg)
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})

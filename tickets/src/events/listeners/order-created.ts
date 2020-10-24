import { Listener, OrderCreatedEvent, Subjects } from '@tickets-448800/common'
import { queueGroupName } from './queue-grou-name'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../models/ticket'
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher'
import { natsWrapper } from '../../nats-wrapper'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated

  queueGroupName = queueGroupName

  async onMessage(data: OrderCreatedEvent['data'], message: Message) {
    const ticket = await Ticket.findById(data.ticket.id)
    if (!ticket) {
      throw new Error('Ticket was not found.')
    }
    ticket.set({ orderId: data.id })
    await ticket.save()
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    })
    message.ack()
  }
}

import { Listener, OrderCreatedEvent, Subjects } from '@tickets-448800/common'
import { queueGroupName } from './queueGroupName'
import { Message } from 'node-nats-streaming'
import { expirationQueue } from '../../queues/expiration-queue'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
  queueGroupName = queueGroupName

  async onMessage(data: OrderCreatedEvent['data'], message: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime()
    console.log('delay', delay)
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      }
    )
    message.ack()
  }
}

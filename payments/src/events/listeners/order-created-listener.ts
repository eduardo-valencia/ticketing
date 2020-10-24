import { Listener, OrderCreatedEvent, Subjects } from '@tickets-448800/common'
import { queueGroupName } from './queue-group-name'
import { Order } from '../../models/order'
import { Message } from 'node-nats-streaming'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated

  queueGroupName = queueGroupName

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    })
    await order.save()
    msg.ack()
  }
}

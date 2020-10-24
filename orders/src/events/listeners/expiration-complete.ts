import {
  Listener,
  ExpirationCompleteEvent,
  Subjects,
  OrderStatus,
} from '@tickets-448800/common'
import { Message } from 'node-nats-streaming'
import { queueGroupName } from './queue-group-name'
import { Order } from '../../models/order'
import { OrderCancelledPublisher } from '../publishers/order-cancelled'

export class ExpirationCompleteListener extends Listener<
  ExpirationCompleteEvent
> {
  readonly subject = Subjects.ExpirationComplete

  queueGroupName = queueGroupName

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket')
    if (!order) {
      throw new Error('Order not found')
    }
    // Because we don't want to cancel an order that has already been completed just because it expired.
    if (order.status === OrderStatus.Complete) {
      return msg.ack()
    }
    order.set({
      status: OrderStatus.Cancelled,
    })
    await order.save()

    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    })
    msg.ack()
  }
}

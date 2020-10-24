import {
  Subjects,
  Publisher,
  OrderCancelledEvent,
} from '@tickets-448800/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
}

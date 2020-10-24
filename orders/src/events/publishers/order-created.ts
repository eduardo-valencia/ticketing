import { Publisher, Subjects, OrderCreatedEvent } from '@tickets-448800/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
}

import {
  Publisher,
  PaymentCreatedEvent,
  Subjects,
} from '@tickets-448800/common'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated
}

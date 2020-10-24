import { Publisher, Subjects, TicketUpdatedEvent } from '@tickets-448800/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
}

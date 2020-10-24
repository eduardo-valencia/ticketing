import { Publisher, Subjects, TicketCreatedEvent } from '@tickets-448800/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
}

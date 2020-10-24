import { Message } from 'node-nats-streaming'
import { Listener } from './base-listener'
import { Subjects } from './subjects'
import { TicketCreatedEvent } from './ticket-created-event'

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  // Without the type, we might accidentally change it to any other property in the Subjects enum.
  // subject: Subjects.TicketCreated = Subjects.TicketCreated

  // Readonly does the same thing
  readonly subject = Subjects.TicketCreated
  queueGroupName = 'payments-service'

  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log('data', data)
    msg.ack()
  }
}

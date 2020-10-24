import { Message } from 'node-nats-streaming'
import { Subjects, Listener, TicketUpdatedEvent } from '@tickets-448800/common'
import { Ticket } from '../../models/ticket'
import { queueGroupName } from './queue-group-name'

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
  queueGroupName = queueGroupName

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findByEvent(data)
    if (!ticket) {
      // Throws error when version mismatch
      throw new Error('Ticket not found')
    }
    const { title, price } = data
    ticket.set({ title, price })
    // Because of the mongoose-current-update plugin, it automatically matches the version with that of the tickets database. That's why we checked if there was a version mistmatch.
    await ticket.save()
    msg.ack()
  }
}

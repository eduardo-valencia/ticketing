import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@tickets-448800/common'

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  readonly subject = Subjects.ExpirationComplete
}

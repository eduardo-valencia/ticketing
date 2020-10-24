import nats from 'node-nats-streaming'
import { TicketCreatedPublisher } from './events/ticket-created-publisher'

console.clear()

// Stan is nats backwards.
const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
})

stan.on('connect', async () => {
  console.log('Publisher connected to NATS')
  // const data = JSON.stringify({
  //   id: 'my ticket id',
  //   title: 'title',
  //   price: 200,
  // })
  // stan.publish('ticket:created', data, () => {
  //   console.log('Event published!')
  // })
  const publisher = new TicketCreatedPublisher(stan)
  await publisher.publish({
    id: '123',
    title: 'my title',
    price: 100,
  })
})

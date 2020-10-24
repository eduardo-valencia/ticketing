import nats from 'node-nats-streaming'
import { TicketCreatedListener } from './events/ticket-created-listener'
import { randomBytes } from 'crypto'

console.clear()

const id = randomBytes(4).toString('hex')
const stan = nats.connect('ticketing', id, {
  url: 'http://localhost:4222',
})

stan.on('connect', () => {
  console.log('Listener connected to NATS')

  stan.on('close', () => {
    console.log('Closed')
    process.exit()
  })

  new TicketCreatedListener(stan).listen()
})

// In case it's manually closed. Will not activate when forcibly closed through the activity monitor.
process.on('SIGINT', () => stan.close())
process.on('SIGTERM', () => stan.close())

// Abstract classes help you with typing

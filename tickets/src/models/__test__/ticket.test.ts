import { Ticket } from '../ticket'

it('implement optimistic concurrency control', async (done) => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123',
  })
  await ticket.save()

  const firstInstance = await Ticket.findById(ticket.id)
  const secondInstance = await Ticket.findById(ticket.id)

  firstInstance!.set({ price: 10 })
  secondInstance!.set({ price: 15 })

  await firstInstance!.save()

  try {
    await secondInstance!.save()
  } catch (error) {
    return done()
  }

  throw new Error(
    'It should have thrown an error while trying to save an outdated version.'
  )
})

it('increments the version number onmultiple saves', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: '123',
  })
  await ticket.save()
  expect(ticket.version).toEqual(0)
  await ticket.save()
  expect(ticket.version).toEqual(1)
})

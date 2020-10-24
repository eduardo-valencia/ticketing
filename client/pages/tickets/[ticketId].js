import React from 'react'
import Router from 'next/router'
import useRequest from '../../hooks/use-request'

export default function TicketShow({ ticket }) {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) =>
      Router.push('/orders/[orderId]', `/orders/${order.id}`),
  })
  return (
    <div>
      <h1>{ticket.title}</h1>
      <p>Price: {ticket.price}</p>
      {errors}
      <button className="btn btn-success" onClick={() => doRequest()}>
        Purchase
      </button>
    </div>
  )
}

TicketShow.getInitialProps = async (context, client) => {
  // Comes from the file name
  const { ticketId } = context.query
  const { data } = await client.get(`/api/tickets/${ticketId}`)
  return { ticket: data }
}

import React from 'react'
import { useState } from 'react'
import useRequest from '../../hooks/use-request'
import Router from 'next/router'

export default function NewTicket() {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title,
      price,
    },
    onSuccess: () => Router.push('/'),
  })

  const handleBlur = () => {
    const value = parseFloat(price)
    if (isNaN(value)) {
      return
    }
    setPrice(value.toFixed(2))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    doRequest()
  }

  return (
    <div>
      <h1>Create a Ticket</h1>
      <form action="" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            className="form-control"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Title</label>
          <input
            className="form-control"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            onBlur={handleBlur}
          />
        </div>
        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

import axios from 'axios'
import { useState } from 'react'

export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null)

  const doRequest = async (props = {}) => {
    try {
      setErrors(null)
      const response = await axios[method](url, {
        ...props,
        ...body,
      })
      if (onSuccess) onSuccess(response.data)
      return response.data
    } catch (error) {
      if (error.response) {
        setErrors(
          <div className="alert alert-danger">
            <h4>There was an error:</h4>
            <ul className="my-0">
              {error.response.data.map((error, index) => (
                <li key={index}>{error.message}</li>
              ))}
            </ul>
          </div>
        )
      }
    }
  }

  return {
    doRequest,
    errors,
  }
}

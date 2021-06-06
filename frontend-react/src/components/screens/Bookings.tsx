import React, { useEffect, useContext, useState } from 'react'
import { withRouter } from 'react-router-dom'
import AuthContext from '../../context/auth-context'
import Spinner from '../../components/Spinner/Spinner'
const BookingsPage = () => {
  const contextType = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [bookings, setBookings] = React.useState<any[]>([])

  useEffect(() => {
    let componentMounted = true
    FetchBookings(componentMounted)
    return () => {
      componentMounted = false
    }
    // eslint-disable-next-line
  }, [])

  const FetchBookings = (componentMounted: boolean) => {
    if (componentMounted) {
      setIsLoading(true)
    }
    const requestBody = {
      query: `
          query {
            bookings{
              _id
              createdAt
              event {
                _id
                title
                date
              }
            }
          }
        `
    }

    //console.log(requestBody)
    fetch('/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + contextType.token
      }
    })
      .then((res) => res.json())
      .then((resData) => {
        //console.log(resData)

        const bookings = resData.data.bookings
        if (componentMounted) {
          setBookings(bookings)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        //console.log(err)
        if (componentMounted) {
          setIsLoading(false)
        }
      })
  }

  return (
    <div className="main-content">
      {isLoading ? (
        <Spinner />
      ) : (
        <ul>
          {bookings.map((booking) => (
            <li key={booking._id}>
              {booking.event.title} -{' '}
              {new Date(booking.createdAt).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default withRouter(BookingsPage)

import React, { useEffect, useContext, useState } from 'react'
import { withRouter } from 'react-router-dom'
import AuthContext from '../../context/auth-context'
import Spinner from '../../components/Spinner/Spinner'
import BookingList from '../../components/Bookings/BookingList/BookingList'
import BookingsChart from '../../components/Bookings/BookingChart/BookingChart'
import BookingsControls from '../../components/Bookings/BookingsControls/BookingsControls'
import Swal from 'sweetalert2'
const BookingsPage = () => {
  // eslint-disable-next-line
  const contextType = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [bookings, setBookings] = React.useState<any[]>([])
  const [outputType, setOutputType] = useState<string>('list')

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
                price
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
        Authorization: 'Bearer ' + localStorage.getItem('localToken')
      }
    })
      .then((res) => res.json())
      .then((resData) => {
        //console.log(resData)

        const bookings = resData.data.bookings
        //console.log(resData.data.bookings)
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

  const deleteBookingHandler = (bookingId: string) => {
    //setIsLoading(true)

    const requestBody = {
      query: `
          mutation CancelBooking ($id: ID!) {
            cancelBooking(bookingId: $id){
              _id
              title
            }
          }
        `,
      variables: {
        id: bookingId
      }
    }

    //console.log(requestBody)
    fetch('/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('localToken')
      }
    })
      .then((res) => res.json())
      .then((resData) => {
        //console.log(resData)
        if (resData.errors) {
          //console.log(resData.errors[0].message)
          //setIsLoading(false)
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: resData.errors[0].message
          })
          return
        }
        //console.log(bookings)
        const updatedBookings = bookings.filter((booking) => {
          return booking._id !== bookingId
        })
        //console.log(updatedBookings)
        setBookings(updatedBookings)
        Swal.fire('Cancelled!', 'Your Booking has been cancelled!', 'success')
        //setIsLoading(false)
      })
      .catch((err) => {
        //console.log(err)
        //setIsLoading(false)
      })
  }

  const changeOutputTypeHandler = (outputType: string) => {
    if (outputType === 'list') {
      setOutputType('list')
    } else {
      setOutputType('chart')
    }
  }
  let content = <Spinner />
  if (!isLoading) {
    content = (
      <React.Fragment>
        <BookingsControls
          activeOutputType={outputType}
          onChange={changeOutputTypeHandler}
        />
        <div>
          {outputType === 'list' ? (
            <BookingList bookings={bookings} onDelete={deleteBookingHandler} />
          ) : (
            <BookingsChart bookings={bookings} />
          )}
        </div>
      </React.Fragment>
    )
  }

  return (
    <div className="main-content">
      {/* {isLoading ? (
        <Spinner />
      ) : (
        <BookingList bookings={bookings} onDelete={deleteBookingHandler} />
      )} */}
      {content}
    </div>
  )
}

export default withRouter(BookingsPage)

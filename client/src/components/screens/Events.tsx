import { withRouter } from 'react-router-dom'
import './Events.css'
import Modal from '../Modal/Modal'
import Backdrop from '../Backdrop/Backdrop'
import React, { useContext, useEffect, useRef, useState } from 'react'
import Swal from 'sweetalert2'
import AuthContext from '../../context/auth-context'
import EventList from '../../components/Events/EventList/EventList'
import Spinner from '../../components/Spinner/Spinner'

const EventsPage = () => {
  const contextType = useContext(AuthContext)
  const [events, setEvents] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedEvent, setSelectedevent] = useState<any>(null)

  const [creating, setCreating] = React.useState<boolean>(false)

  const titleEL = useRef<HTMLInputElement>(null)
  const priceEL = useRef<HTMLInputElement>(null)
  const dateEL = useRef<HTMLInputElement>(null)
  const descriptionEL = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    let componentMounted = true
    FetchEvents(componentMounted)

    return () => {
      componentMounted = false
    }
  }, [])

  const modalConfirmHandler = () => {
    if (titleEL && titleEL.current) {
      titleEL.current.focus()
    }
    if (priceEL && priceEL.current) {
      priceEL.current.focus()
    }
    if (dateEL && dateEL.current) {
      dateEL.current.focus()
    }
    if (descriptionEL && descriptionEL.current) {
      descriptionEL.current.focus()
    }

    const title: string = titleEL.current?.value!
    const price: number = +priceEL.current?.value!
    const date: string = dateEL.current?.value!
    const description: string = descriptionEL.current?.value!

    if (
      title?.trim().length === 0 ||
      price <= 0 ||
      date?.trim().length === 0 ||
      description?.trim().length === 0
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Need to fill all fields or Price is worthless'
      })
      return
    }

    setCreating(false)
    //const event = { title, price, date, description }
    //console.log(event)

    const requestBody = {
      query: `
          mutation CreateEvent($title: String!, $price: Float!, $date: String!, $description: String!) {
            createEvent(eventInput: {title: $title, price: $price, date: $date, description: $description}){
              _id
              title
              description
              date
              price
            }
          }
        `,
      variables: {
        title: title,
        price: price,
        date: date,
        description: description
      }
    }

    //console.log(requestBody)
    const token = contextType.token

    fetch('/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((resData) => {
        //console.log(resData)
        if (resData.errors) {
          //console.log(resData.errors[0].message)
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: resData.errors[0].message
          })
          return
        }

        //console.log(resData.data.createEvent)
        setEvents([
          ...events,
          {
            _id: resData.data.createEvent._id,
            title: resData.data.createEvent.title,
            price: resData.data.createEvent.price,
            description: resData.data.createEvent.description,
            date: resData.data.createEvent.date,
            creator: {
              _id: contextType.userId
            }
          }
        ])
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Event Created Successfully',
          showConfirmButton: false,
          timer: 1200
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const FetchEvents = (componentMounted: boolean) => {
    if (componentMounted) {
      setIsLoading(true)
    }
    const requestBody = {
      query: `
          query {
            events{
              _id
              title
              description
              date
              price
              creator {
                _id
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
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((resData) => {
        //console.log(resData)

        const events = resData.data.events
        if (componentMounted) {
          setEvents(events)
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

  const CreateEventModal = () => {
    setCreating(true)
  }

  const modalCancelHandler = () => {
    setCreating(false)
    setSelectedevent(null)
  }

  const bookEventHandler = () => {
    if (!contextType.token) {
      setSelectedevent(null)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'To Book an Event you must be logged in'
      })
      return
    }

    const requestBody = {
      query: `
          mutation BookEvent($id: ID!) {
            bookEvent(eventId: $id){
              _id
              createdAt
              updatedAt
            }
          }
        `,
      variables: {
        id: selectedEvent._id
      }
    }

    const token = contextType.token

    fetch('/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((resData) => {
        // console.log(resData)
        if (resData.errors) {
          //console.log(resData.errors[0].message)
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: resData.errors[0].message
          })
          return
        }
        setSelectedevent(null)
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Selected Event booked Successfully',
          showConfirmButton: false,
          timer: 1200
        })
      })

      .catch((err) => {
        console.log(err)
      })
  }

  const showDetailHandler = (eventId: string) => {
    const selected = events.find((e) => e._id === eventId)
    //console.log(selected)
    setSelectedevent(selected)
  }

  return (
    <div className="main-content">
      <React.Fragment>
        {contextType.token && (
          <div className="events-control">
            <p>Share your own Events!!</p>
            <button className="btn" onClick={CreateEventModal}>
              Create Event
            </button>
          </div>
        )}

        {(creating || selectedEvent) && <Backdrop />}

        {creating && (
          <Modal
            title="Add New Event"
            canCancel={true}
            canConfirm={true}
            onCancel={modalCancelHandler}
            onConfirm={modalConfirmHandler}
            confirmText="Confirm"
          >
            <form>
              <div className="form__group field">
                <input
                  type="input"
                  className="form__field"
                  ref={titleEL}
                  placeholder="Title"
                  name="title"
                  id="title"
                  required
                />
                <label htmlFor="title" className="form__label">
                  Title
                </label>
              </div>
              <div className="form__group field">
                <input
                  type="number"
                  min="0"
                  className="form__field"
                  ref={priceEL}
                  placeholder="Price"
                  name="price"
                  id="price"
                  required
                />
                <label htmlFor="price" className="form__label">
                  Price
                </label>
              </div>
              <div className="form__group field">
                <input
                  type="datetime-local"
                  className="form__field"
                  ref={dateEL}
                  placeholder="Date"
                  name="date"
                  id="date"
                  required
                />
                <label htmlFor="date" className="form__label">
                  Date
                </label>
              </div>
              <div className="form-description">
                <label htmlFor="description">Description</label>
                <br></br>
                <textarea
                  id="description"
                  ref={descriptionEL}
                  rows={4}
                  style={{ width: '100%', resize: 'vertical' }}
                ></textarea>
              </div>
            </form>
          </Modal>
        )}

        {selectedEvent && (
          <Modal
            title={selectedEvent.title}
            canCancel={true}
            canConfirm={true}
            onCancel={modalCancelHandler}
            onConfirm={bookEventHandler}
            confirmText="Book"
          >
            <h1>{selectedEvent.title}</h1>
            <h2>
              ${selectedEvent.price} -{' '}
              {new Date(selectedEvent.date).toLocaleDateString()}
            </h2>
            <p>{selectedEvent.description}</p>
          </Modal>
        )}

        {isLoading ? (
          <Spinner />
        ) : (
          <EventList
            events={events}
            authUserId={contextType.userId}
            onViewDetail={showDetailHandler}
          />
        )}
      </React.Fragment>
    </div>
  )
}

export default withRouter(EventsPage)

import { withRouter } from 'react-router-dom'
import './Events.css'
import ModalCreated from '../Modal/Modal'
import Backdrop from '../Backdrop/Backdrop'
import React, { useContext, useEffect, useRef } from 'react'
import Swal from 'sweetalert2'
import AuthContext from '../../context/auth-context'

const EventsPage = () => {
  const contextType = useContext(AuthContext)
  const [events, setEvents] = React.useState<any[]>([])

  useEffect(() => {
    FetchEvents()
  }, [])

  let props = {
    title: 'Add Events',
    children: null,
    canCancel: true,
    canConfirm: true,
    onCancel: () => modalCancelHandler(),
    onConfirm: () => modalConfirmHandler()
  }
  const [creating, setCreating] = React.useState<boolean>(false)

  const titleEL = useRef<HTMLInputElement>(null)
  const priceEL = useRef<HTMLInputElement>(null)
  const dateEL = useRef<HTMLInputElement>(null)
  const descriptionEL = useRef<HTMLTextAreaElement>(null)

  const CreateEventModal = () => {
    setCreating(true)
  }

  const modalCancelHandler = () => {
    setCreating(false)
  }

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

    const title = titleEL.current?.value as any
    let price = priceEL.current?.value as any
    const date = dateEL.current?.value as any
    const description = descriptionEL.current?.value as any

    if (
      title?.trim().length === 0 ||
      price?.trim().length === 0 ||
      date?.trim().length === 0 ||
      description?.trim().length === 0
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Need to fill all fields'
      })
      return
    }

    setCreating(false)
    price = +price
    const event = { title, price, date, description }
    console.log(event)

    const requestBody = {
      query: `
          mutation {
            createEvent(eventInput: {title: "${title}", price: ${price}, date: "${date}", description: "${description}"}){
              _id
              title
              description
              date
              price
              creator {
                _id
                email
              }
            }
          }
        `
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

        console.log(resData.data.createEvent)
        setEvents([...events, resData.data.createEvent])
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

  const FetchEvents = () => {
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
                email
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
        setEvents(events)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <div className="main-content">
      <React.Fragment>
        {creating && <Backdrop />}
        {creating && (
          <ModalCreated {...props}>
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
          </ModalCreated>
        )}
        {contextType.token && (
          <div className="events-control">
            <p>Share your own Events!!</p>
            <button className="btn" onClick={CreateEventModal}>
              Create Event
            </button>
          </div>
        )}

        <ul className="events__list">
          <p>Created Events so far!</p>
          {events.map((event) => {
            return (
              <li className="events__list-items" key={event._id}>
                {event.title}
              </li>
            )
          })}
        </ul>
      </React.Fragment>
    </div>
  )
}

export default withRouter(EventsPage)

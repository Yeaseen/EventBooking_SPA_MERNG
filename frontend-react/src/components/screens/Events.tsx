// eslint-disable-next-line
//import React, { useEffect, useState, useContext } from 'react'
import { withRouter } from 'react-router-dom'
import './Events.css'
import ModalCreated from '../Modal/Modal'
import Backdrop from '../Backdrop/Backdrop'
import React from 'react'

const EventsPage = () => {
  let props = {
    title: 'Add Events',
    children: null,
    canCancel: true,
    canConfirm: true,
    onCancel: () => modalCancelHandler(),
    onConfirm: () => modalConfirmHandler()
  }
  const [creating, setCreating] = React.useState<boolean>(false)

  const CreateEventModal = () => {
    setCreating(true)
  }

  const modalCancelHandler = () => {
    setCreating(false)
  }

  const modalConfirmHandler = () => {
    setCreating(false)
  }

  return (
    <div className="main-content">
      {creating && <Backdrop />}
      {creating && (
        <ModalCreated {...props}>
          <form>
            <div className="form__group field">
              <input
                type="input"
                className="form__field"
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
                type="date"
                className="form__field"
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
                rows={4}
                style={{ width: '100%', resize: 'vertical' }}
              ></textarea>
            </div>
          </form>
        </ModalCreated>
      )}
      <div className="events-control">
        <p>Share your own Events!!</p>
        <button className="btn" onClick={CreateEventModal}>
          Create Event
        </button>
      </div>
    </div>
  )
}

export default withRouter(EventsPage)

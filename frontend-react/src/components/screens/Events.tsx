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
          <p>Modal Content</p>
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

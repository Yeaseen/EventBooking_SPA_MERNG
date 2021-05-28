// eslint-disable-next-line
//import React, { useEffect, useState, useContext } from 'react'
import { withRouter } from 'react-router-dom'
import './Events.css'
import ModalCreated from '../Modal/Modal'
import React from 'react'

const EventsPage = () => {
  let props = {
    title: 'Add Events',
    children: null,
    canCancel: true,
    canConfirm: true
  }
  return (
    <div className="main-content">
      <ModalCreated {...props}>
        <p>Modal Content</p>
      </ModalCreated>
      <div className="events-control">
        <p>Share your own Events!!</p>
        <button className="btn">Create Event</button>
      </div>
    </div>
  )
}

export default withRouter(EventsPage)

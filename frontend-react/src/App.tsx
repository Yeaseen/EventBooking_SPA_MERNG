import React, { useEffect } from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import AuthPage from './components/Auth'
import BookingsPage from './components/Bookings'
import EventsPage from './components/Events'

import './App.css'

const Routing = () => {
  useEffect(() => {}, [])

  return (
    <Switch>
      <Redirect from="/" to="/auth" exact />

      <Route exact path="/auth">
        <AuthPage />
      </Route>

      <Route exact path="/events">
        <EventsPage />
      </Route>

      <Route exact path="/bookings">
        <BookingsPage />
      </Route>
    </Switch>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routing />
    </BrowserRouter>
  )
}

export default App

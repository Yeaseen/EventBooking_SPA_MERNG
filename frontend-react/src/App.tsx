import React, { useEffect } from 'react'

import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import './App.css'
import AuthPage from './components/screens/Auth'
import BookingsPage from './components/screens/Bookings'
import EventsPage from './components/screens/Events'
import MainNavigation from './components/Navigation/MainNavber'

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
      <MainNavigation />
      <Routing />
    </BrowserRouter>
  )
}

export default App

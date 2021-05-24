import React, { useEffect, useState } from 'react'

import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import './App.css'
import AuthPage from './components/screens/Auth'
import BookingsPage from './components/screens/Bookings'
import EventsPage from './components/screens/Events'
import MainNavigation from './components/Navigation/MainNavber'

import AuthContext from './context/auth-context'

const Routing = (props: { token: null | string }) => {
  useEffect(() => {}, [])

  return (
    <Switch>
      {!props.token && <Redirect from="/" to="/auth" exact />}
      {props.token && <Redirect from="/" to="/events" exact />}
      {props.token && <Redirect from="/auth" to="/events" exact />}

      {!props.token && (
        <Route exact path="/auth">
          <AuthPage />
        </Route>
      )}
      <Route exact path="/events">
        <EventsPage />
      </Route>

      {props.token && (
        <Route exact path="/bookings">
          <BookingsPage />
        </Route>
      )}
    </Switch>
  )
}

function App() {
  const [token, setToken] = useState<null | string>(null)
  const [userId, setUserId] = useState<null | string>(null)

  const login = (token: string, userId: string, tokenExpiration: string) => {
    setToken(token)
    setUserId(userId)
  }

  const logout = () => {
    setToken(null)
    setUserId(null)
  }
  return (
    <BrowserRouter>
      <AuthContext.Provider
        value={{
          token: token,
          userId: userId,
          login: login,
          logout: logout
        }}
      >
        <MainNavigation />
        <Routing token={token} />
      </AuthContext.Provider>
    </BrowserRouter>
  )
}

export default App

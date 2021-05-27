import { useState } from 'react'

import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

import './App.css'
import AuthPage from './components/screens/Auth'
import BookingsPage from './components/screens/Bookings'
import EventsPage from './components/screens/Events'
import MainNavigation from './components/Navigation/MainNavber'
import AuthContext from './context/auth-context'

const Routing = (props: { token: null | string }) => {
  return (
    <Switch>
      {props.token && <Redirect from="/" to="/events" exact />}
      {props.token && <Redirect from="/auth" to="/events" exact />}

      {!props.token && <Route exact path="/auth" component={AuthPage} />}

      <Route exact path="/events" component={EventsPage} />
      {props.token && <Route exact path="/bookings" component={BookingsPage} />}

      {!props.token && <Redirect to="/auth" exact />}
    </Switch>
  )
}

function App() {
  //const history = useHistory()
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

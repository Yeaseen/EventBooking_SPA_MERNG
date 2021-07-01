import { useState, useEffect, useContext } from 'react'

import {
  BrowserRouter,
  Route,
  Switch,
  Redirect,
  useHistory
} from 'react-router-dom'

import './App.css'
import AuthPage from './components/screens/Auth'
import BookingsPage from './components/screens/Bookings'
import EventsPage from './components/screens/Events'
import MainNavigation from './components/Navigation/MainNavber'
import AuthContext from './context/auth-context'

const Routing = () => {
  const contextType = useContext(AuthContext)
  const history = useHistory()
  useEffect(() => {
    let localtoken = localStorage.getItem('localToken')
    if (typeof localtoken !== 'string') {
      localtoken = null
    }

    let localuserId = localStorage.getItem('localUserId')
    if (typeof localuserId !== 'string') {
      localuserId = null
    }

    let localtokenExpiration = localStorage.getItem('localTokenExpiration')
    if (typeof localtokenExpiration !== 'string') {
      localtokenExpiration = null
    }

    //console.log(localtoken, localuserId, localtokenExpiration)

    if (localtoken && localuserId && localtokenExpiration) {
      contextType.login(localtoken, localuserId, localtokenExpiration)
    } else {
      history.push('/auth')
    }
  }, [contextType, history])

  return (
    <Switch>
      {contextType.token && <Redirect from="/" to="/events" exact />}
      {contextType.token && <Redirect from="/auth" to="/events" exact />}

      <Route exact path="/auth" component={AuthPage} />

      <Route exact path="/bookings" component={BookingsPage} />

      <Route exact path="/events" component={EventsPage} />
    </Switch>
  )
}

function App() {
  //const history = useHistory()
  const [token, setToken] = useState<null | string>(null)
  const [userId, setUserId] = useState<null | string>(null)
  const [tokenExpiration, setTokenExpiration] = useState<null | string>(null)

  const login = (token: string, userId: string, tokenExpiration: string) => {
    setToken(token)
    setUserId(userId)
    setTokenExpiration(tokenExpiration)
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
          tokenExpiration: tokenExpiration,
          login: login,
          logout: logout
        }}
      >
        <MainNavigation />
        <Routing />
      </AuthContext.Provider>
    </BrowserRouter>
  )
}

export default App

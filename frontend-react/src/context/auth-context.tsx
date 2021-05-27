import { createContext } from 'react'

import { userContextState } from './type'

const contextDefaultValues: userContextState = {
  token: null,
  userId: null,
  login: (token: string, userId: string, tokenExpiration: string) => {},
  logout: () => {}
}

export default createContext<userContextState>(contextDefaultValues)

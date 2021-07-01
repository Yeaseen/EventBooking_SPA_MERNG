export type userContextState = {
  token: null | string
  userId: null | string
  tokenExpiration: null | string
  login: (token: string, userId: string, tokenExpiration: string) => void
  logout: () => void
}

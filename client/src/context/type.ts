export type userContextState = {
  token: null | string
  userId: null | string
  login: (token: string, userId: string, tokenExpiration: string) => void
  logout: () => void
}

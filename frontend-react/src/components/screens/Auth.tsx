// eslint-disable-next-line
import React, { useEffect, useContext, useRef, FormEvent } from 'react'
import { Link, withRouter } from 'react-router-dom'
import './Auth.css'
import Swal from 'sweetalert2'

import AuthContext from '../../context/auth-context'

const AuthPage = () => {
  const emailEL = useRef<HTMLInputElement>(null)
  const passwordEL = useRef<HTMLInputElement>(null)
  const [isLogin, setIsLogin] = React.useState<boolean>(true)

  const contextType = useContext(AuthContext)

  const switchModeHandler = () => {
    setIsLogin(!isLogin)
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (emailEL && emailEL.current) {
      emailEL.current.focus()
    }
    if (passwordEL && passwordEL.current) {
      passwordEL.current.focus()
    }

    const email = emailEL.current?.value
    const password = passwordEL.current?.value

    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        String(email).toLowerCase()
      )
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Invalid email or password!'
      })
      return
    }

    //console.log(email, password)

    let requestBody = {
      query: `
        query {
          login(email: "${email}", password: "${password}") {
            userId
            token
            tokenExpiration
          }
        }
         `
    }
    if (!isLogin) {
      requestBody = {
        query: `
          mutation {
            createUser(userInput: {email: "${email}", password: "${password}"}){
              _id
              email
            }
          }
        `
      }
    }

    fetch('/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.errors) {
          console.log(resData.errors[0].message)
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: resData.errors[0].message
          })
          return
        } else {
          console.log(resData)
          if (resData.data.login.token) {
            contextType.login(
              resData.data.login.token,
              resData.data.login.userId,
              resData.data.login.tokenExpiration
            )

            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: isLogin
                ? 'Logged in Successfully'
                : 'Singed up Successfully',
              showConfirmButton: false,
              timer: 1200
            })
            return
          }
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <div className="main-content">
      <form className="auth-form" onSubmit={onSubmit}>
        <h2>SimpleEvent</h2>

        <div className="form__group field">
          <input
            type="input"
            ref={emailEL}
            className="form__field"
            placeholder="Email"
            name="email"
            id="email"
            required
          />
          <label htmlFor="email" className="form__label">
            Email
          </label>
        </div>

        <div className="form__group field">
          <input
            type="password"
            ref={passwordEL}
            className="form__field"
            placeholder="Password"
            name="password"
            id="password"
            required
          />
          <label htmlFor="password" className="form__label">
            Password
          </label>
        </div>

        <div className="form-actions">
          <button type="submit">Submit</button>
          <button type="button" onClick={switchModeHandler}>
            Switch to {isLogin ? 'Signup' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default withRouter(AuthPage)

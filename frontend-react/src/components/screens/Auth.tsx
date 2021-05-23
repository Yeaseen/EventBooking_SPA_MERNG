// eslint-disable-next-line
import React, { useEffect, useState, useRef, FormEvent } from 'react'
import { Link, withRouter } from 'react-router-dom'
import './Auth.css'

const AuthPage = () => {
  const email = useRef<HTMLInputElement>(null)
  const password = useRef<HTMLInputElement>(null)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (email && email.current) {
      email.current.focus()
    }
    if (password && password.current) {
      password.current.focus()
    }
    console.log(email.current?.value)
    console.log(password.current?.value)
  }

  return (
    <div className="main-content">
      <form className="auth-form" onSubmit={onSubmit}>
        <h2>SimpleEvent</h2>

        <div className="form__group field">
          <input
            type="input"
            ref={email}
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
            ref={password}
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
          <button type="button">Switch to Login</button>
        </div>
      </form>
    </div>
  )
}

export default withRouter(AuthPage)

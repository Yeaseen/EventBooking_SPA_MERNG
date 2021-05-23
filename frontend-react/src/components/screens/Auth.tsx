// eslint-disable-next-line
import React, { useEffect, useState, useContext } from 'react'
import { Link, withRouter } from 'react-router-dom'
import './Auth.css'

const AuthPage = () => {
  return (
    <div className="main-content">
      <form className="auth-form">
        <h2>SimpleEvent</h2>
        <div className="form-control">
          <label htmlFor="email">E-mail</label>
          <input type="email" id="email" placeholder="name@gmail.com" />
        </div>

        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" />
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

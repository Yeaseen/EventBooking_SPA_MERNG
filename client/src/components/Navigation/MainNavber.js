import React from 'react'
import { NavLink } from 'react-router-dom'
import AuthContext from '../../context/auth-context'
import './MainNavigation.css'
import Swal from 'sweetalert2'
const mainNavigation = (props) => (
  <AuthContext.Consumer>
    {(context) => {
      return (
        <header className="main-navigation">
          <div className="main-navigation__logo">
            <h2>EventPlanner</h2>
          </div>
          <nav className="main-navigation__items">
            <ul>
              {!context.token && (
                <li>
                  <NavLink to="/auth">Authenticate</NavLink>
                </li>
              )}
              <li>
                <NavLink to="/events">Events</NavLink>
              </li>
              {context.token && (
                <React.Fragment>
                  <li>
                    <NavLink to="/bookings">Bookings</NavLink>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        localStorage.clear()
                        context.logout()
                        Swal.fire({
                          position: 'top-end',
                          icon: 'success',
                          title: 'Logged out successfully',
                          showConfirmButton: false,
                          timer: 1200
                        })
                      }}
                    >
                      Logout
                    </button>
                  </li>
                </React.Fragment>
              )}
            </ul>
          </nav>
        </header>
      )
    }}
  </AuthContext.Consumer>
)

export default mainNavigation

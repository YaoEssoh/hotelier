import React from 'react'
import { Link } from 'react-router-dom';
import LogoutButton from '../views/Hotel/Logout';

function NavBar() {
  const user = JSON.parse(localStorage.getItem("user"))
  const userName=user.utilisateur.nom
  const userPrenom = user.utilisateur.prenom

  return (
    <div>
      {" "}
      <div className="iq-top-navbar">
        <div className="iq-navbar-custom">
          <nav className="navbar navbar-expand-lg navbar-light p-0">
            <div className="iq-navbar-logo d-flex align-items-center justify-content-between">
              <i className="ri-menu-line wrapper-menu" />
              <a href="../backend/index.html" className="header-logo">
                <h4 className="logo-title text-uppercase">Hotelier</h4>
              </a>
            </div>
            <div className="navbar-breadcrumb">
              <h5>Dashboard</h5>
            </div>
            <div className="d-flex align-items-center">
              <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-label="Toggle navigation"
              >
                <i className="ri-menu-3-line" />
              </button>
              <div
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
              >
                <ul className="navbar-nav ml-auto navbar-list align-items-center">
                
                
                  <li className="nav-item nav-icon dropdown caption-content">
                    <a
                      href="#"
                      className="search-toggle dropdown-toggle  d-flex align-items-center"
                      id="dropdownMenuButton4"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                   
                      <div className="caption ml-3">
                        <h6 className="mb-0 line-height">
                          {userName}{""} {userPrenom}
                          <i className="las la-angle-down ml-2" />
                        </h6>
                      </div>
                    </a>
                    <ul
                      className="dropdown-menu dropdown-menu-right border-none"
                      aria-labelledby="dropdownMenuButton"
                    >
                      <li className="dropdown-item d-flex svg-icon">
                        <svg
                          className="svg-icon mr-0 text-primary"
                          id="h-01-p"
                          width={20}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <Link to="/userprofil">My Profile</Link>
                      </li>
                      <li className="dropdown-item d-flex svg-icon">
                        <svg
                          className="svg-icon mr-0 text-primary"
                          id="h-02-p"
                          width={20}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        <Link to="/EditProfil">Edit Profile</Link>
                        </li>
                  
                    
                      <LogoutButton />
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </div>{" "}
    </div>
  );
}

export default NavBar
import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaHotel, FaUserFriends, FaCalendarAlt, FaClipboardList } from "react-icons/fa";
import { FaExclamationCircle } from "react-icons/fa";


function SideBar() {
  return (
    <div>
      <div className="iq-sidebar sidebar-default">
        <div className="iq-sidebar-logo d-flex align-items-center">
          <a href="../backend/index.html" className="header-logo">
            <h3 className="logo-title light-logo">Hotelier</h3>
          </a>
          <div className="iq-menu-bt-sidebar ml-0">
            <i className="las la-bars wrapper-menu" />
          </div>
        </div>

        <div className="data-scrollbar" data-scroll="1">
          <nav className="iq-sidebar-menu">
            <ul id="iq-sidebar-toggle" className="iq-menu">
              <li className="active">
                <Link to="/" className="svg-icon">
                  <FaHome size={20} />
                  <span className="ml-4">Dashboard</span>
                </Link>
              </li>

              <li>
                <Link to="/hotels" className="svg-icon">
                  <FaHotel size={20} />
                  <span className="ml-4">Hotels List</span>
                </Link>
              </li>

              <li>
                <Link to="/clients" className="svg-icon">
                  <FaUserFriends size={20} />
                  <span className="ml-4">Clients List</span>
                </Link>
              </li>
              

              <li>
                <Link to="/reservation" className="svg-icon">
                  <FaClipboardList size={20} />
                  <span className="ml-4">Reservation List</span>
                </Link>
              </li>

              <li>
                <Link to="/calender" className="svg-icon">
                  <FaCalendarAlt size={20} />
                  <span className="ml-4">Calendar</span>
                </Link>
             </li>

            <li>
             <Link to="/reclamations" className="svg-icon" >
                    <FaExclamationCircle size={20} />
                    <span className="ml-4">Réclamations</span>
                </Link>
              </li>
            </ul>
          </nav>
          <div className="pt-5 pb-2" />
        </div>
      </div>
    </div>
  );
}

export default SideBar;

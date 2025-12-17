import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="side-top">
        <div className="avatar">
          <img src="https://i.pravatar.cc/100?img=64" alt="user" />
        </div>

        <ul className="nav">
          <li className="nav-item">
            <NavLink to="/" activeclassname="active">Dashboard</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/shared" activeclassname="active">Shared files</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/favorites" activeclassname="active">Favorites</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/upload" activeclassname="active">Upload files</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/profile" activeclassname="active">Profile</NavLink>
          </li>
        </ul>
      </div>

      <div className="side-bottom">
        <NavLink to="/login" className="auth-btn login-btn">Login</NavLink>
        <NavLink to="/signup" className="auth-btn signup-btn">Signup</NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;

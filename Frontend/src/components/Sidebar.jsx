import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = () => {
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();

  // Check if user is logged in (adjust key if you store user differently)
  const user = JSON.parse(localStorage.getItem("user"));

  // Logout handler


  return (
    <aside className="sidebar">
      <div className="side-top">
        <div className="avatar">
          <img src="https://e7.pngegg.com/pngimages/550/997/png-clipart-user-icon-foreigners-avatar-child-face.png" alt="user" />
          {user && <p className="username">{user.name || "User"}</p>}
        </div>

        <ul className="nav">
          <li className="nav-item">
            <NavLink to="/" activeclassname="active">Dashboard</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/upload" activeclassname="active">Upload Files</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/favorites" activeclassname="active">Favorites</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/recycle" activeclassname="active">Recycle Bin</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/profile" activeclassname="active">Profile</NavLink>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;

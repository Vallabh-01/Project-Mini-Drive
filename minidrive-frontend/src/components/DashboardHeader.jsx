import React from "react";
import "../styles/DashboardHeader.css";

const DashboardHeader = ({ query, onQuery }) => {
  return (
    <header className="topbar">
      <input
        className="search"
        placeholder="Search"
        type="text"
        value={query}
        onChange={(e) => onQuery?.(e.target.value)}
      />
    </header>
  );
};

export default DashboardHeader;

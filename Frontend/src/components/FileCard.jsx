import React from "react";
import "../styles/FileCard.css";

const FileCard = ({ file, onDetails, getFileIcon, formatBytes }) => {
  // Clean filename by removing ID prefixes or timestamps
  const getCleanName = (name = "") => {
    const parts = name.split(/[_-]/);
    if (parts[0].length > 10) parts.shift(); // if prefix is long (likely an ID), remove it
    return parts.join("_");
  };

  const rawName = file.originalname || file.filename || "Unnamed file";
  const cleanName = getCleanName(rawName);
  const fileType = file.mimetype ? file.mimetype.split("/")[1]?.toUpperCase() : "Unknown";

  return (
    <div className="card">
      {/* File Icon */}
      <div className="file-icon-container">
        <div className="file-icon">{getFileIcon(file.mimetype)}</div>
      </div>

      {/* File Info */}
      <div className="file-info-grid">
        <div className="file-name" title={cleanName}>
          {cleanName.length > 20 ? cleanName.slice(0, 20) + "..." : cleanName}
        </div>
        <div className="file-meta">
          <span className="file-type">{fileType}</span> •{" "}
          <span className="file-size">{formatBytes(file.size || 0)}</span>
        </div>
      </div>

      {/* Single Action Button */}
      <div className="file-buttons">
        <button className="btn" onClick={() => onDetails(file)} title="View Details">
          <svg className="svg-icon" viewBox="0 0 24 24">
            <path
              d="M12 5a7 7 0 0 1 7 7 7 7 0 0 1-7 7 7 7 0 0 1-7-7 7 7 0 0 1 7-7zm0 4v4m0 4h.01"
              strokeWidth="2"
              fill="none"
              stroke="currentColor"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FileCard;

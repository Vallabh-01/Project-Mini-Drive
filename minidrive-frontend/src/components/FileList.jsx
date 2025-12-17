import React from "react";
import "../styles/FileList.css";
import { useFiles, formatBytes } from "../state/useFiles";

const FileList = () => {
  const fs = useFiles(); // Access shared file state (from context or Layout)
  const items = fs.filtered || [];

  // Debug log (optional — remove after confirming IDs)
  console.log("File items:", items);

  return (
    <div className="filelist">
      <h3 className="section-title">My Files</h3>

      <div className="cards-files">
        {items.length === 0 ? (
          <p className="no-files">No files available</p>
        ) : (
          items.map((f, index) => (
            <div key={f._id || index} className="file-card">
              <div className="file-row">
                <div
                  className="file-left"
                  onClick={() => fs.showDetails(f._id)}
                  role="button"
                >
                  <span className="file-blob">🗂️</span>
                  <div className="file-name">{f.name}</div>
                </div>

                <div className="file-actions">
                  <button
                    title="Download"
                    onClick={() => fs.actions.download(f._id)}
                  >
                    ⤵️
                  </button>
                  <button
                    title="Share"
                    onClick={() => fs.actions.share(f._id)}
                  >
                    🔗
                  </button>
                  <button
                    title="More"
                    onClick={() => fs.showDetails(f._id)}
                  >
                    ⋯
                  </button>
                </div>
              </div>

              <div className="file-meta">
                <span>{formatBytes(f.size)}</span>
                <span>{new Date(f.createdAt).toLocaleDateString()}</span>
                <span
                  className={`pill ${
                    f.status === "Shared" ? "green" : "gray"
                  }`}
                >
                  {f.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FileList;

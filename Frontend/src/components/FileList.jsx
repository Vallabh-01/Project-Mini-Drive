import React from "react";
import "../styles/FileList.css";
import { useFiles, formatBytes } from "../state/useFiles";

const FileList = () => {
  const fs = useFiles();
  ({ filesHook: fs }) // uses the same instance since hook lives up in Layout; if rendering here directly, lift it to context or pass via props.

  const items = fs.filtered;

  return (
    <div className="filelist">
      <h3 className="section-title">My files</h3>
      <div className="cards-files">
        {items.map(f => (
          <div key={f.id} className="file-card">
            <div className="file-row">
              <div className="file-left" onClick={()=>fs.showDetails(f.id)} role="button">
                <span className="file-blob">🗂️</span>
                <div className="file-name">{f.name}</div>
              </div>
              <div className="file-actions">
                <button title="Download" onClick={()=>fs.actions.download(f.id)}>⤵️</button>
                <button title="Share" onClick={()=>fs.actions.share(f.id)}>🔗</button>
                <button title="More" onClick={()=>fs.showDetails(f.id)}>⋯</button>
              </div>
            </div>
            <div className="file-meta">
              <span>{formatBytes(f.size)}</span>
              <span>{f.uploaded}</span>
              <span className={`pill ${f.status === "Shared" ? "green" : "gray"}`}>{f.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileList;

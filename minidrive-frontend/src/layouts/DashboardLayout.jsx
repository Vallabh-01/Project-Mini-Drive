import React from "react";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import "../styles/DashboardLayout.css";
import FileList from "../components/FileList";
import { useFiles, formatBytes } from "../state/useFiles";

const DashboardLayout = () => {
  const fs = useFiles();

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-area">
        <DashboardHeader query={fs.query} onQuery={fs.setQuery} />

        <div className="grid-2">
          {/* Center column */}
          <section className="center-column">
            <FileList />
          </section>

          {/* Right column */}
          <aside className="right-column">
            <div className="upload-tile">
              <div className="upload-icon">⤴️</div>
              <div className="upload-text">Add new files</div>
            </div>

            <div className="storage-card">
              <div className="storage-title">
                Your storage <span className="storage-left">25% left</span>
              </div>
              <div className="storage-sub">75 GB of 100 GB are used</div>
              <div className="progress-rail">
                <div className="progress-bar" style={{ width: "75%" }} />
              </div>
            </div>
          </aside>
        </div>
        {fs.selected && (
          <div className="details-drawer">
            {(() => {
              const f = fs.get(fs.selected);
              if (!f) return null;
              return (
                <div className="details-panel">
                  <div className="details-head">
                    <div className="details-icon">🗂️</div>
                    <div>
                      <div className="details-name">{f.name}</div>
                      <div className="details-sub">{f.kind} • {formatBytes(f.size)}</div>
                    </div>
                    <button className="details-close" onClick={fs.hideDetails}>✕</button>
                  </div>

                  <div className="details-grid">
                    <div>
                      <div className="label">Type</div>
                      <div className="value">{f.type}</div>
                    </div>
                    <div>
                      <div className="label">Path</div>
                      <div className="value">{f.path}</div>
                    </div>
                    <div>
                      <div className="label">Uploaded</div>
                      <div className="value">{f.uploaded}</div>
                    </div>
                    <div>
                      <div className="label">Status</div>
                      <div className="value">{f.status}</div>
                    </div>
                    <div>
                      <div className="label">Owners</div>
                      <div className="value">{(f.owners || []).join(", ")}</div>
                    </div>
                  </div>

                  <div className="details-actions">
                    <button onClick={() => fs.actions.download(f._id)}>Download</button>
                    <button onClick={() => fs.actions.share(f._id)}>Share</button>
                    <button className="danger" onClick={() => { fs.actions.remove(f._id); fs.hideDetails(); }}>Delete</button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
        {fs.toast && (
          <div className="toast">
            <span>{fs.toast.message}</span>
            {fs.toast.actionLabel && (
              <button onClick={() => { fs.toast.onAction?.(); fs.setToast(null); }}>
                {fs.toast.actionLabel}
              </button>
            )}
            <button className="toast-close" onClick={() => fs.setToast(null)}>✕</button>
          </div>
        )}

      </main>
    </div>
  );
};

export default DashboardLayout;

import React, { useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import "../styles/DashboardLayout.css";
import "../styles/UploadFilesPage.css";
import API from "../api/axios";

export default function UploadFilesPage() {
  const inputRef = useRef(null);
  const [queue, setQueue] = useState([]);

  function onPick() {
    inputRef.current?.click();
  }

  function addFiles(fileList) {
    const items = Array.from(fileList).map((f) => ({
      id: `${f.name}-${f.size}-${Math.random().toString(36).slice(2)}`,
      file: f,
      name: f.name,
      size: f.size,
      type: f.type || "file",
      progress: 0,
      status: "queued",
    }));
    setQueue((q) => [...q, ...items]);
  }

  function onInputChange(e) {
    addFiles(e.target.files || []);
    e.target.value = "";
  }

  function onDrop(e) {
    e.preventDefault();
    if (e.dataTransfer?.files?.length) addFiles(e.dataTransfer.files);
  }

  function onDragOver(e) {
    e.preventDefault();
  }

  async function startUpload(item) {
    const formData = new FormData();
    formData.append("file", item.file);

    try {
      const response = await API.post("/files", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setQueue((q) =>
            q.map((it) =>
              it.id === item.id ? { ...it, progress, status: "uploading" } : it
            )
          );
        },
      });

      setQueue((q) =>
        q.map((it) =>
          it.id === item.id
            ? { ...it, status: "done", id: response.data.data._id }
            : it
        )
      );
    } catch (error) {
      console.error("Error uploading file:", error);
      setQueue((q) =>
        q.map((it) => (it.id === item.id ? { ...it, status: "error" } : it))
      );
    }
  }

  function removeItem(id) {
    setQueue((q) => q.filter((it) => it.id !== id));
  }

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-area">
        <DashboardHeader />

        <section className="upload-wrap">
          <h1 className="page-title">Upload files</h1>

          <div
            className="upload-dropzone"
            onClick={onPick}
            onDrop={onDrop}
            onDragOver={onDragOver}
            role="button"
            tabIndex={0}
          >
            <div className="drop-icon">⤴</div>
            <div className="drop-title">Drag and drop files here</div>
            <div className="drop-sub">or click to browse</div>
            <input
              ref={inputRef}
              type="file"
              multiple
              onChange={onInputChange}
              hidden
            />
          </div>

          <h2 className="section-title">Queue</h2>

          <ul className="queue-list">
            {queue.length === 0 && (
              <li className="queue-empty">No files added yet</li>
            )}

            {queue.map((item) => (
              <li key={item.id} className="queue-row">
                <div className="q-left">
                  <span className="q-blob" />
                  <div className="q-meta">
                    <div className="q-name">{item.name}</div>
                    <div className="q-sub">
                      {item.type || "file"} • {Math.round(item.size / 1024)} kb
                    </div>
                  </div>
                </div>

                <div className="q-progress">
                  <div
                    className={`q-bar ${item.status}`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>

                <div className={`q-status ${item.status}`}>
                  {item.status === "queued" && "Queued"}
                  {item.status === "uploading" && `${item.progress}%`}
                  {item.status === "done" && "Completed"}
                  {item.status === "error" && "Error"}
                </div>

                <div className="q-actions">
                  {item.status === "queued" && (
                    <button
                      className="btn"
                      onClick={() => startUpload(item)}
                      title="Start upload"
                    >
                      ▶
                    </button>
                  )}
                  {item.status !== "uploading" && (
                    <button
                      className="btn"
                      onClick={() => removeItem(item.id)}
                      title="Remove"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

import React, { useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import "../styles/DashboardLayout.css";
import "../styles/UploadFilesPage.css";
import { uploadFile } from "../api/fileService"; // ✅ Import the API

export default function UploadFilesPage() {
  const inputRef = useRef(null);
  const [queue, setQueue] = useState([]);

  const onPick = () => inputRef.current?.click();

  const addFiles = (fileList) => {
    const items = Array.from(fileList).map((f) => ({
      id: `${f.name}-${Date.now()}`,
      file: f,
      name: f.name,
      size: f.size,
      type: f.type || "file",
      progress: 0,
      status: "queued",
    }));
    setQueue((q) => [...q, ...items]);
  };

  const onInputChange = (e) => {
    addFiles(e.target.files || []);
    e.target.value = "";
  };

  const onDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer?.files?.length) addFiles(e.dataTransfer.files);
  };

  const onDragOver = (e) => e.preventDefault();

  const startUpload = async (itemId) => {
    const item = queue.find((it) => it.id === itemId);
    if (!item) return;

    setQueue((q) =>
      q.map((it) => (it.id === itemId ? { ...it, status: "uploading" } : it))
    );

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please login again.");

      const formData = new FormData();
      formData.append("file", item.file);

      await uploadFile(item.file, token); // call API

      setQueue((q) =>
        q.map((it) =>
          it.id === itemId
            ? { ...it, progress: 100, status: "done" }
            : it
        )
      );
    } catch (err) {
      console.error("Upload error:", err);
      setQueue((q) =>
        q.map((it) =>
          it.id === itemId ? { ...it, status: "error" } : it
        )
      );
    }
  };

  const removeItem = (id) => setQueue((q) => q.filter((it) => it.id !== id));

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-area">
        <DashboardHeader />

        <section className="upload-wrap">
          <h1 className="page-title">Upload Files</h1>

          <div
            className="upload-dropzone"
            onClick={onPick}
            onDrop={onDrop}
            onDragOver={onDragOver}
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
                  {item.status === "error" && "Failed"}
                </div>

                <div className="q-actions">
                  {item.status === "queued" && (
                    <button
                      className="btn"
                      onClick={() => startUpload(item.id)}
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

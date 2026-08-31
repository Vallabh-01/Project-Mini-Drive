import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import "../styles/DashboardLayout.css";
import "../styles/RecycleBinPage.css";
import {
  getTrashedFiles,
  restoreFile,
  deleteFilePermanently,
} from "../api/fileService";

export default function RecycleBinPage() {
  const [files, setFiles] = useState([]);
  const [toast, setToast] = useState(null);

  const displayName = (file) => {
    if (file?.originalname && typeof file.originalname === "string") return file.originalname;
    const raw = file?.filename || "";
    return raw.replace(/^[0-9a-fA-F-]{8,}-/, "");
  };

  const normalizeFileType = (mimetype = "") => {
    if (!mimetype) return "File";
    if (mimetype.includes("image")) return "Image";
    if (mimetype.includes("video")) return "Video";
    if (mimetype.includes("audio")) return "Audio";
    if (mimetype.includes("pdf")) return "PDF";
    if (mimetype.includes("word") || mimetype.includes("document")) return "Word";
    if (mimetype.includes("excel")) return "Excel";
    if (mimetype.includes("text")) return "Text";
    return "File";
  };

  const getFileIcon = (type = "") => {
    const t = normalizeFileType(type);
    switch (t) {
      case "Image": return "🖼️";
      case "Video": return "🎬";
      case "Audio": return "🎵";
      case "PDF": return "📄";
      case "Word": return "📝";
      case "Excel": return "📊";
      case "Text": return "📄";
      default: return "📁";
    }
  };

  const fetchTrashedFiles = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await getTrashedFiles(token);
      const filesArray = Array.isArray(res.data) ? res.data : [];
      setFiles(filesArray);
    } catch (err) {
      console.error("Error fetching trashed files:", err);
      showToast("Failed to load trashed files ❌");
    }
  };

  useEffect(() => {
    fetchTrashedFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showToast = (message) => {
    setToast({ message });
    setTimeout(() => setToast(null), 2500);
  };

  const handleRestore = async (fileId) => {
    try {
      const token = localStorage.getItem("token");
      await restoreFile(fileId, token);
      setFiles((prev) => prev.filter((f) => f._id !== fileId));
      showToast("File restored successfully ✅");
    } catch (err) {
      console.error(err);
      showToast("Failed to restore file ❌");
    }
  };

  const handlePermanentDelete = async (fileId) => {
    try {
      const token = localStorage.getItem("token");
      await deleteFilePermanently(fileId, token);
      setFiles((prev) => prev.filter((f) => f._id !== fileId));
      showToast("File deleted permanently 🗑️");
    } catch (err) {
      console.error(err);
      // showToast("Failed to delete file ❌");
    }
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-area">
        <DashboardHeader />

        <section className="shared-wrap">
          <h1 className="page-title">Recycle Bin</h1>

          {files.length === 0 ? (
            <p className="empty-msg">No files in trash.</p>
          ) : (
            <div className="trash-grid">
              {files.map((file) => {
                const typeLabel = normalizeFileType(file.mimetype);
                return (
                  <div className="trash-card" key={file._id}>
                    <div className="card-head">
                      <div className={`file-avatar ${typeLabel.toLowerCase()}`}>
                        {getFileIcon(file.mimetype)}
                      </div>
                      <div className="card-title" title={displayName(file)}>
                        {displayName(file)}
                      </div>
                      <div className="card-sub">
                        {typeLabel} • {(file.size / 1024).toFixed(2)} KB
                      </div>
                    </div>

                    <div className="card-meta">
                      <span className="meta-pill">{typeLabel}</span>
                      <span className="meta-dot">•</span>
                      <span className="meta-text">{file.mimetype}</span>
                    </div>

                    <div className="card-actions">
                      <button
                        className="btn ghost"
                        onClick={() => handleRestore(file._id)}
                        aria-label="Restore"
                        title="Restore"
                      >
                        <span className="icon">♻️</span>
                        <span className="label">Restore</span>
                      </button>
                      <button
                        className="btn danger"
                        onClick={() => handlePermanentDelete(file._id)}
                        aria-label="Delete permanently"
                        title="Delete permanently"
                      >
                        <span className="icon">🗑️</span>
                        <span className="label">Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {toast && (
          <div className="toast">
            <span>{toast.message}</span>
            <button className="toast-close" onClick={() => setToast(null)}>
              ✕
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

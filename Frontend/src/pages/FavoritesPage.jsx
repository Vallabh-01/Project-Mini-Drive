/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import "../styles/DashboardLayout.css";
import "../styles/RecycleBinPage.css"; // reuse card/grid styles
import {
  getFavoriteFiles,
  setFavorite,
} from "../api/fileService";

export default function FavoritesPage() {
  const [files, setFiles] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const displayName = (file) => {
    if (file?.originalname && typeof file.originalname === "string") return file.originalname;
    const raw = file?.filename || "";
    return raw.replace(/^[0-9a-fA-F-]{8,}-/, "");
  };

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await getFavoriteFiles(token);
      setFiles(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      showToast("Failed to load favorites ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const showToast = (message) => {
    setToast({ message });
    setTimeout(() => setToast(null), 2500);
  };

  const handleToggleFavorite = async (fileId, next) => {
    try {
      const token = localStorage.getItem("token");
      await setFavorite(fileId, next, token);
      setFiles((prev) => prev.map((f) => (f._id === fileId ? { ...f, isFavorite: next } : f)));
      showToast(next ? "Added to favorites ⭐" : "Removed from favorites ✖️");
    } catch (e) {
      showToast("Failed to update favorite ❌");
    }
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-area">
        <DashboardHeader />

        <section className="shared-wrap">
          <h1 className="page-title">Favorites</h1>

          {loading ? (
            <p className="empty-msg">Loading favorites…</p>
          ) : files.length === 0 ? (
            <p className="empty-msg">No favorites yet.</p>
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
                        onClick={() => handleToggleFavorite(file._id, !file.isFavorite)}
                        aria-label={file.isFavorite ? "Unfavorite" : "Favorite"}
                        title={file.isFavorite ? "Unfavorite" : "Favorite"}
                      >
                        <span className="icon">{file.isFavorite ? "★" : "☆"}</span>
                        <span className="label">{file.isFavorite ? "Unfavorite" : "Favorite"}</span>
                      </button>
                      <a
                        className="btn"
                        href={`/api/files/${file._id}/download`}
                        onClick={(e) => {
                          e.preventDefault();
                          window.open(`/api/files/${file._id}/download`, "_blank");
                        }}
                        aria-label="Download"
                        title="Download"
                      >
                        <span className="icon">⬇️</span>
                        <span className="label">Download</span>
                      </a>
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

import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import FileCard from "../components/Filecard"; // ✅ Correct casing
import "../styles/DashboardLayout.css";
import { getFiles, deleteFile, setFavorite } from "../api/fileService"; // ⬅️ added setFavorite
import { formatBytes } from "../state/useFiles";

const DashboardLayout = () => {
  const [files, setFiles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);

  // Fetch files from API
  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please login again.");
      const res = await getFiles(token);
      setFiles(res?.data || []);
    } catch (err) {
      console.error("Error fetching files:", err);
      setToast({ message: "Failed to load files" });
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const showDetails = (file) => setSelected(file);
  const hideDetails = () => setSelected(null);

  const downloadFile = async (fileId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/files/${fileId}/download`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      const file = files.find((f) => f._id === fileId);
      a.download = file?.name || file?.originalname || "file";
      a.href = url;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setToast({ message: "Download failed" });
    }
  };

  const removeFile = async (fileId) => {
    try {
      const token = localStorage.getItem("token");
      await deleteFile(fileId, token);
      setFiles((prev) => prev.filter((f) => f._id !== fileId));
      setToast({ message: "File deleted successfully" });
      hideDetails();
    } catch (err) {
      console.error(err);
      setToast({ message: "Failed to delete file" });
    }
  };

  const normalizeFileType = (mimetype = "") => {
    if (!mimetype) return "File";
    if (mimetype.includes("image")) return "Image";
    if (mimetype.includes("video")) return "Video";
    if (mimetype.includes("audio")) return "Audio";
    if (mimetype.includes("pdf")) return "PDF";
    if (
      mimetype.includes("word") ||
      mimetype.includes("officedocument") ||
      mimetype.includes("document")
    )
      return "Word";
    if (mimetype.includes("excel")) return "Excel";
    if (mimetype.includes("text")) return "Text";
    return "File";
  };

  const getFileIcon = (type = "") => {
    const t = normalizeFileType(type);
    switch (t) {
      case "Image":
        return "🖼️";
      case "Video":
        return "🎬";
      case "Audio":
        return "🎵";
      case "PDF":
        return "📄";
      case "Word":
        return "📝";
      case "Excel":
        return "📊";
      case "Text":
        return "📄";
      default:
        return "📁";
    }
  };

  // ⬇️ added minimal handler (used only by the new drawer button)
  const handleToggleFavorite = async (fileId, next) => {
    try {
      const token = localStorage.getItem("token");
      await setFavorite(fileId, next, token);
      setFiles((prev) => prev.map((f) => (f._id === fileId ? { ...f, isFavorite: next } : f)));
      setSelected((prev) => (prev && prev._id === fileId ? { ...prev, isFavorite: next } : prev));
      setToast({ message: next ? "Added to favorites ⭐" : "Removed from favorites ✖️" });
    } catch (err) {
      console.error(err);
      setToast({ message: "Failed to update favorite" });
    }
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-area">
        <DashboardHeader />

        <div className="grid-2">
          <section className="center-column">
            <div className="section">
              <h3 className="section-title">Recent files</h3>
              <div className="file-cards-grid">
                {files.length === 0 && <p>No files found.</p>}
                {files.map((f) => (
                  <FileCard
                    key={f._id}
                    file={f}
                    onDetails={showDetails} // ✅ use existing function
                    getFileIcon={getFileIcon}
                    formatBytes={formatBytes}
                  />
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* File Details Drawer */}
        {selected && (
          <div className="details-drawer">
            <div className="details-panel">
              <div className="details-head">
                <div className="details-icon" style={{ fontSize: "2rem" }}>
                  {getFileIcon(selected.mimetype)}
                </div>
                <div>
                  <div className="details-name">
                    {selected.originalname || selected.filename}
                  </div>
                  <div className="details-sub">
                    {normalizeFileType(selected.mimetype)} •{" "}
                    {formatBytes(selected.size || 0)}
                  </div>
                </div>
                <button className="details-close" onClick={hideDetails}>
                  ✕
                </button>
              </div>

              <div className="details-grid">
                <div>
                  <div className="label">Path</div>
                  <div className="value">{selected.path || "-"}</div>
                </div>
                <div>
                  <div className="label">Uploaded</div>
                  <div className="value">
                    {selected.uploadedAt
                      ? new Date(selected.uploadedAt).toLocaleString()
                      : "-"}
                  </div>
                </div>
                <div>
                  <div className="label">Status</div>
                  <div className="value">{selected.status || "Available"}</div>
                </div>
              </div>

              <div className="details-actions">
                {/* ⬇️ NEW Favorite button — only this line block is added */}
                <button
                  onClick={() => handleToggleFavorite(selected._id, !selected.isFavorite)}
                  title={selected.isFavorite ? "Unfavorite" : "Favorite"}
                >
                  {selected.isFavorite ? "★ Unfavorite" : "☆ Favorite"}
                </button>

                <button onClick={() => downloadFile(selected._id)}>Download</button>
                <button onClick={() => alert("Share logic")}>Share</button>
                <button className="danger" onClick={() => removeFile(selected._id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

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
};

export default DashboardLayout;

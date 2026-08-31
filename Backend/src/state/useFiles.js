import { useState, useEffect, useCallback } from "react";
import * as fileService from "../api/fileService";

// Helper function to format bytes
export function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Custom hook for file management
export function useFiles() {
  const [files, setFiles] = useState([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all files on mount
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await fileService.getAllFiles();
        setFiles(data);
      } catch (err) {
        console.error("Error fetching files:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 🔍 Filtered files (search)
  const filtered = files.filter(f =>
    f.filename?.toLowerCase().includes(query.toLowerCase())
  );

  // 📂 Get file by ID
  const get = useCallback(id => files.find(f => f._id === id), [files]);

  // 🧾 File Actions
  const actions = {
    // Upload new file
    upload: async (file) => {
      try {
        const uploaded = await fileService.uploadFile(file);
        setFiles(prev => [uploaded, ...prev]);
        setToast({ message: "File uploaded successfully!" });
      } catch (err) {
        setToast({ message: "Upload failed" });
      }
    },

    // Download file
    download: async (id) => {
      try {
        await fileService.downloadFile(id);
      } catch (err) {
        setToast({ message: "Download failed" });
      }
    },

    // Delete file
    remove: async (id) => {
      try {
        await fileService.deleteFile(id);
        setFiles(prev => prev.filter(f => f._id !== id));
        setToast({ message: "File deleted" });
      } catch (err) {
        setToast({ message: "Delete failed" });
      }
    },

    // Share file (future implementation)
    share: async (id) => {
      console.log("Share feature coming soon:", id);
      setToast({ message: "Share feature not yet implemented" });
    }
  };

  // 📋 Show/hide details
  const showDetails = id => setSelected(id);
  const hideDetails = () => setSelected(null);

  return {
    files,
    filtered,
    query,
    setQuery,
    selected,
    showDetails,
    hideDetails,
    get,
    actions,
    toast,
    setToast,
    loading
  };
}

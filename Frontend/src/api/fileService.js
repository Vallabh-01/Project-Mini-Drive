import axios from "./axios";

const FILES_URL = "/files";

// Upload
export const uploadFile = (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append("file", file);
  const config = {};
  if (typeof onUploadProgress === "function") {
    config.onUploadProgress = onUploadProgress;
  }
  return axios.post(`${FILES_URL}/upload`, formData, config);
};

// Active files
export const getFiles = (token) =>
  axios.get(FILES_URL, { headers: { Authorization: `Bearer ${token}` } });

// Move to trash
export const deleteFile = (id, token) =>
  axios.delete(`${FILES_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });

// Trash
export const getTrashedFiles = (token) =>
  axios.get(`${FILES_URL}/trash`, { headers: { Authorization: `Bearer ${token}` } });

export const restoreFile = (id, token) =>
  axios.patch(`${FILES_URL}/${id}/restore`, null, { headers: { Authorization: `Bearer ${token}` } });

export const deleteFilePermanently = (id, token) =>
  axios.delete(`${FILES_URL}/${id}/permanent`, { headers: { Authorization: `Bearer ${token}` } });

// Favorites
export const getFavoriteFiles = (token) =>
  axios.get(`${FILES_URL}/favorites`, { headers: { Authorization: `Bearer ${token}` } });

export const setFavorite = (id, isFavorite, token) =>
  axios.patch(`${FILES_URL}/${id}/favorite`, { isFavorite }, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Utils
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export default {
  uploadFile,
  getFiles,
  deleteFile,
  getTrashedFiles,
  restoreFile,
  deleteFilePermanently,
  getFavoriteFiles,
  setFavorite,
};

// src/components/PdfUploader.js
import { useState } from "react";
import axios from "axios";

export default function PdfUploader() {
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post("/api/upload", formData);
    window.location.href = `/documents/${response.data._id}`;
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button type="submit">Upload PDF</button>
    </form>
  );
}

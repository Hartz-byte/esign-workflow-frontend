// src/pages/index.js
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function Home() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      alert("Please select a PDF file");
      e.target.value = null;
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      router.push(`/documents/${response.data.id}`);
    } catch (error) {
      console.error("Upload error:", error);
      alert(
        error.response?.data?.details ||
          error.response?.data?.error ||
          "Upload failed. Please try again."
      );
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-gray-300">
        <h1 className="text-2xl font-semibold text-center mb-6 text-black">
          Upload a PDF
        </h1>
        <form onSubmit={handleUpload} className="space-y-4">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full p-2 border rounded mb-4 text-black"
            disabled={uploading}
          />
          {uploadProgress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded transition ${
              uploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
            disabled={uploading || !file}
          >
            {uploading ? `Uploading... ${uploadProgress}%` : "Upload PDF"}
          </button>
        </form>
      </div>
    </div>
  );
}

// src/pages/documents/index.js
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DocumentsList() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/documents`
      );
      setDocuments(response.data);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Documents</h1>
        <button
          onClick={() => router.push("/")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Upload New Document
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-xl transition"
            onClick={() => router.push(`/documents/${doc.id}`)}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-semibold truncate">{doc.filename}</h2>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  doc.status === "COMPLETED"
                    ? "bg-green-100 text-green-800"
                    : doc.status === "SIGNING"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {doc.status}
              </span>
            </div>

            <div className="text-sm text-gray-600">
              <p>Created: {new Date(doc.createdAt).toLocaleDateString()}</p>
              <p>Signers: {doc.signers.length}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

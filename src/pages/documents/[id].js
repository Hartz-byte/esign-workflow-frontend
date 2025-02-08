// src/pages/documents/[id].js
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import PDFViewer from "../../components/PDFViewer";
import SignerForm from "../../components/SignerForm";
import SignerList from "../../components/SignerList";

export default function DocumentPage() {
  const router = useRouter();
  const { id } = router.query;
  const [document, setDocument] = useState(null);
  const [signerForm, setSignerForm] = useState({
    email: "",
    role: "ROLE_1",
    page: 1,
    position: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) fetchDocument();
  }, [id]);

  const fetchDocument = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/documents/${id}`);
      setDocument(response.data);
    } catch (err) {
      setError("Failed to load document");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePositionSelect = (page, position) => {
    setSignerForm((prev) => ({
      ...prev,
      page,
      position,
    }));
  };

  const handleAddSigner = async (e) => {
    e.preventDefault();
    if (!signerForm.position) {
      alert(
        "Please select a position for the signature by clicking on the PDF"
      );
      return;
    }

    try {
      setLoading(true);
      await axios.post(`/api/documents/${id}/signers`, signerForm);
      await fetchDocument();
      setSignerForm({
        email: "",
        role: "ROLE_1",
        page: 1,
        position: null,
      });
    } catch (err) {
      setError("Failed to add signer");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await axios.post(`/api/documents/${id}/submit`);
      alert("Document submitted for signing!");
      router.push("/documents");
    } catch (err) {
      setError("Failed to submit document");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !document) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-600">Loading document...</div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - PDF Viewer */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-2xl font-bold mb-4">Document Preview</h2>
            {document && document.cloudinaryUrl ? (
              <PDFViewer
                url={document.cloudinaryUrl}
                onPositionSelect={handlePositionSelect}
                key={document.cloudinaryUrl}
                selectedPosition={
                  signerForm.position &&
                  signerForm.page === document.currentPage
                    ? signerForm.position
                    : null
                }
              />
            ) : (
              <div className="text-red-500">No document URL available</div>
            )}
          </div>
        </div>

        {/* Right Column - Forms and Controls */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-bold mb-4">Add Signer</h2>
            <SignerForm
              formData={signerForm}
              onChange={setSignerForm}
              onSubmit={handleAddSigner}
              disabled={loading}
            />
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-bold mb-4">Current Signers</h2>
            <SignerList signers={document?.signers || []} />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !document?.signers?.length}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            Submit for Signing
          </button>
        </div>
      </div>
    </div>
  );
}

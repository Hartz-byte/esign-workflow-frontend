// src/pages/api/documents/[id]/submit.js
import axios from "axios";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    switch (req.method) {
      case "POST":
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/pdf/${id}/submit`
        );
        return res.status(200).json(response.data);

      default:
        res.setHeader("Allow", ["POST"]);
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("API error:", error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      error: "Failed to submit document",
      details: error.response?.data || error.message,
    });
  }
}

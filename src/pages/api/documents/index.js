// src/pages/api/documents/index.js
import axios from "axios";

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case "GET":
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/pdf`
        );
        return res.status(200).json(response.data);

      default:
        res.setHeader("Allow", ["GET"]);
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("API error:", error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      error: "Failed to fetch documents",
      details: error.response?.data || error.message,
    });
  }
}

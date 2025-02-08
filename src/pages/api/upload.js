// src/pages/api/upload.js
import axios from "axios";
import formidable from "formidable";
import fs from "fs";
import FormData from "form-data";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const form = formidable({
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB limit
    });

    const [fields, files] = await form.parse(req);
    const file = files.file?.[0];

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Create form data
    const formData = new FormData();
    const fileStream = fs.createReadStream(file.filepath);

    formData.append("file", fileStream, {
      filename: file.originalFilename,
      contentType: file.mimetype,
    });

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/pdf/upload`,
        formData,
        {
          headers: formData.getHeaders(),
        }
      );

      // Clean up temporary file
      fs.unlink(file.filepath, (err) => {
        if (err) console.error("Error deleting temporary file:", err);
      });

      return res.status(200).json(response.data);
    } catch (uploadError) {
      console.error(
        "Backend upload error:",
        uploadError.response?.data || uploadError.message
      );
      return res.status(uploadError.response?.status || 500).json({
        error: "Upload to backend failed",
        details: uploadError.response?.data || uploadError.message,
      });
    }
  } catch (error) {
    console.error("Request handling error:", error);
    return res.status(500).json({
      error: "Upload failed",
      details: error.message,
    });
  }
}

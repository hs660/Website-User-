"use client";

import { useState } from "react";
import axios from "../../../utils/api.js";
import { getAuth } from "firebase/auth";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");

  const Base_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleUpload = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) return alert("Login required");

    const token = await user.getIdToken();

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("tags", tag);

    await axios.post(`${Base_URL}/api/images/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert("Uploaded 🚀");
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <input
        type="text"
        placeholder="Title"
        className="border p-2 w-full mb-3"
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="text"
        placeholder="Tag"
        className="border p-2 w-full mb-3"
        onChange={(e) => setTag(e.target.value)}
      />

      <input
        type="file"
        className="mb-3"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        onClick={handleUpload}
        className="bg-red-500 text-white px-4 py-2"
      >
        Upload
      </button>
    </div>
  );
}
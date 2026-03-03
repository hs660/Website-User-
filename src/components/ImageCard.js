"use client";

import { useState } from "react";
import { getAuth } from "firebase/auth";



export default function ImageCard({ image }) {
  const [likeCount, setLikeCount] = useState(image?.likesCount || 0);
  const Base_URL= process.env.NEXT_PUBLIC_API_URL

const handleLike = async () => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    alert("Please login to like this image");
    return;
  }

  const token = await auth.currentUser.getIdToken();
  try {
    const res = await fetch(`${Base_URL}/api/images/like/${image._id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      if (res.status === 401) alert("Session expired. Please login again.");
      return;
    }

    const data = await res.json();
    if (data?.likesCount !== undefined) setLikeCount(data.likesCount);

  } catch (error) {
    console.error("Like error:", error);
  }
};


  return (
    <>
    <div className="">
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img
        src={image.imageUrl}
        alt={image.title}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          {image.title}
        </h3>

        <button
          onClick={handleLike}
          className={`flex items-center gap-2 transition-colors ${likeCount > 0 ? "text-red-500" : "text-gray-600"
            }`}
        >
          ❤️
          <span className="text-sm font-medium">
            Likes: {likeCount}
          </span>
        </button>
      </div>
    </div>
    </div>
    </>
  );
}
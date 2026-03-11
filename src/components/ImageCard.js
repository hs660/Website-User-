"use client";

import { useState } from "react";
import { getAuth } from "firebase/auth";
import { Heart } from "lucide-react";



export default function ImageCard({ image }) {
  const [isLiked, setIsLiked] = useState(image?.isLiked || false)
  const [likeCount, setLikeCount] = useState(image?.likesCount || 0);
  const Base_URL = process.env.NEXT_PUBLIC_API_URL

  const handleLike = async () => {

    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert("Please login to like this image");
      return;
    }

    // ⭐ instant UI change
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

    const token = await currentUser.getIdToken();

    try {
      await fetch(`${Base_URL}/api/images/like/${image._id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

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
            onDoubleClick={handleLike}
            className="w-full h-48 object-cover cursor-pointer"
          />

          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              {image.title}
            </h3>

            <button
              onClick={handleLike}
              className="flex items-center gap-2 transition-colors group
            "
            >
              <Heart
                className={`w-6 h-6 transition-all duration-200 ${isLiked
                    ? "text-red-500 fill-red-500 scale-110"
                    : "text-gray-600 group-hover:text-red-400"
                  }`}
              />
              <span className="text-sm font-medium">
                {likeCount}
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import { useState } from "react";
import { getAuth } from "firebase/auth";
import { Heart } from "lucide-react";

export default function ImageCard({ image, onUnlike = null }) {

  const [isLiked, setIsLiked] = useState(image?.isLiked || false);
  const [likeCount, setLikeCount] = useState(image?.likesCount || 0);
  const [loading, setLoading] = useState(false);

  const Base_URL = process.env.NEXT_PUBLIC_API_URL;
  const getTagColor = (tag) => {
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
      hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }
    return tagColors[Math.abs(hash) % tagColors.length];
  }
  const handleDownload = async () => {
    try {
      const response = await fetch(image.imageUrl);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = image.title || "image.jpg";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Download failed", error);
    }
  };
  const handleLike = async () => {

    if (loading) return;

    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert("Please login to like this image");
      return;
    }
    const previousLiked = isLiked;

    //  instant UI
    setIsLiked(!previousLiked);

    setLoading(true);

    try {

      const token = await currentUser.getIdToken();

      const res = await fetch(`${Base_URL}/api/images/like/${image._id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      //   count sync
      setLikeCount(data.likesCount);

      // liked page remove
      if (!previousLiked && !data.liked && onUnlike) {
        onUnlike(image._id);
      }

    } catch (error) {

      console.error("Like error:", error);

      // revert
      setIsLiked(previousLiked);

    } finally {

      setLoading(false);

    }

  };

  return (
    <div>
      <div className="bg-white rounded-xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">

        <div className="relative group overflow-hidden rounded-xl">
          <img
            src={image.imageUrl}
            alt={image.title}
            onDoubleClick={handleLike}
            className="w-full h-48 object-cover transform group-hover:scale-110 transition duration-300"
          />

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition duration-300"></div>
        </div>

        <div className="p-4">

          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            {image.title}
          </h3>
          {/* TAGS */}
          <div className="flex flex-wrap gap-2">
            {image.tags && (
              <span
                className={`text-xs px-3 py-1 rounded-full text-white font-medium shadow-sm ${getTagColor(image.tags)}`}
              >
                {image.tags}
              </span>
            )}
          </div>
          <button
            onClick={handleLike}

            className="flex items-center gap-2 transition-colors group"
          >

            <Heart
              className={`w-6 h-6 transition-all duration-300 ${isLiked
                ? "text-red-500 fill-red-500 scale-125"
                : "text-gray-600 group-hover:text-red-400"
                }`}
            />

            <span className="text-sm font-medium">
              {likeCount}
            </span>

          </button>
          <button
            onClick={handleDownload}
            className="text-xs px-3 py-1 bg-green-100 text-green-600 rounded"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
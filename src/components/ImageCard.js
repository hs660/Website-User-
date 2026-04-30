"use client";

import { useState } from "react";
import { getAuth } from "firebase/auth";
import { Heart, ArrowDownToLine } from "lucide-react";

export default function ImageCard({ image, onUnlike = null }) {

  const [isLiked, setIsLiked] = useState(image?.isLiked || false);
  const [likeCount, setLikeCount] = useState(image?.likesCount || 0);
  const [loading, setLoading] = useState(false);
   const tagColors = [
    "bg-blue-500",
    "bg-indigo-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-rose-500",
    "bg-emerald-500",
    "bg-teal-500",
    "bg-cyan-500",
    "bg-amber-500",
    "bg-orange-500",
  ];
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
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 group">

      {/* IMAGE */}
      <div className="relative overflow-hidden">
        <img
          src={image.imageUrl}
          alt={image.title}
          onDoubleClick={handleLike}
          className="w-full h-52 object-cover transition duration-500 group-hover:scale-110 cursor-pointer"
        />

        {/* Download Button (Top Right) */}
        <button
          onClick={handleDownload}
          className="absolute top-3 right-3 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-gray-800 hover:bg-white transition opacity-0 group-hover:opacity-100"
        >
          ⬇ Download
        </button>

      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-3">

        {/* TITLE */}
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
          {image.title}
        </h3>

        {/* TAG */}
        {image.tags && (
          <span
            className={`inline-block text-xs px-3 py-1 rounded-full text-white font-medium shadow ${getTagColor(image.tags)}`}
          >
            #{image.tags}
          </span>
        )}

        {/* BOTTOM */}
        <div className="flex items-center justify-between pt-2">

          {/* LIKE */}
          <button
            onClick={handleLike}
            className="flex items-center gap-2 group"
          >
            <Heart
              className={`w-5 h-5 transition-all duration-300 ${
                isLiked
                  ? "text-red-500 fill-red-500 scale-125"
                  : "text-gray-600 group-hover:text-red-400"
              }`}
            />
            <span className="text-sm font-medium text-gray-700">
              {likeCount}
            </span>
          </button>

          {/* SMALL DOWNLOAD (Mobile friendly) */}
          <div className="flex items-center justify-between pt-2">
            <ArrowDownToLine/>
          <button
            onClick={handleDownload}
            className="text-xs px-3 py-1 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition"
          >
            Download
          </button>
          </div>

        </div>

      </div>
    </div>
  </div>
);
}
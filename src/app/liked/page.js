"use client";

import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import axios from "axios";
import ImageCard from "@/components/ImageCard";

const Base_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LikedPage() {

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLikedImages();
  }, []);

  const fetchLikedImages = async () => {

    try {

      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        setImages([]);
        return;
      }

      const token = await user.getIdToken();

      const res = await axios.get(
        `${Base_URL}/api/images/liked`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

     
      const likedImages = Array.isArray(res.data)
        ? res.data.map(img => ({
            ...img,
            isLiked: true
          }))
        : [];

      setImages(likedImages);

    } catch (error) {
      console.error("Error fetching liked images:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleUnlike = (imageId) => {
    setImages(prev =>
      prev.filter(img => img._id !== imageId)
    );
  };

  /* Loading UI */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-slate-900 text-lg">
          Loading liked images...
        </p>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto py-10 px-4">

      <div className="mb-8 text-center">
        <p className="text-3xl font-bold text-gray-500 mt-2">
          ❤️ Your Liked Images
        </p>
      </div>

      {images.length === 0 ? (
        <p className="text-slate-800 text-center mt-10">
          You haven't liked any images yet.
        </p>
      ) : (

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {images.map((img) => (
            <ImageCard
              key={img._id}
              image={img}
              onUnlike={handleUnlike}
            />
          ))}

        </div>

      )}

    </section>
  );
}
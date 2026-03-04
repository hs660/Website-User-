"use client";

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ImageCard from "@/components/ImageCard";
import axios from "axios";

export default function LikePage() {
  const [likeImages, setLikeImages] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const Base_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(currentUser);

      try {
        const token = await currentUser.getIdToken();

        const res = await axios.get(
          `${Base_URL}/api/images/liked`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setLikeImages(res.data);
      } catch (error) {
        console.log("Error fetching liked images:", error);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!user) {
    return (
      <div className="text-center mt-10 text-red-500 font-semibold">
        Please login to see liked images
      </div>
    );
  }

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Liked Images</h1>

        {likeImages.length === 0 ? (
          <p className="text-gray-500 text-lg">No Like Image</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {likeImages.map((img) => (
              <ImageCard key={img._id} image={img} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
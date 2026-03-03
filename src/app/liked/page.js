"use client";

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ImageCard from "@/components/ImageCard";
import axios from "axios";

export default function LikePage() {
  const [likeImages, setLikeImages] = useState([]);
  const Base_URL= process.env.NEXT_PUBLIC_API_URL



useEffect(() => {
  const auth = getAuth();

  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (!user) {
      console.log("No user logged in");
      return;
    }

    console.log("User found:", user.email);

    const token = await user.getIdToken();

    const res = await axios.get(
      `${Base_URL}api/images/liked`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setLikeImages(res.data);
  });

  return () => unsubscribe();
}, []);

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Liked Images</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {likeImages.map((img) => (
            <ImageCard key={img._id} image={img} />
          ))}
        </div>
      </div>
    </section>
  );
}
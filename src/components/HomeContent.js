"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ImageCard from "@/components/ImageCard";
import { useSearchParams } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function HomeContent() {

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") || "home";

  const Base_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {

    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {

      try {

        setLoading(true);

        let headers = {};

        if (user) {
          const token = await user.getIdToken();
          headers.Authorization = `Bearer ${token}`;
        }

        const res = await axios.get(
          `${Base_URL}/api/images?sort=${sort}`,
          { headers }
        );

        setImages(res.data);

      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }

    });

    return () => unsubscribe();

  }, [sort]);

  if (loading) {
    return <p>Loading images...</p>;
  }

  return (
    <div className="grid grid-cols-4 gap-6">
      {images?.map((img) => (
        <ImageCard key={img._id} image={img} />
      ))}
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ImageCard from "@/components/ImageCard";
import { useSearchParams } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import FilterBar from "@/components/FilterTag";

export default function HomeContent() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();

  const sort = searchParams.get("sort") || "latest";
  const tag = searchParams.get("tag") || "all";
  console.log(tag);

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

        // 🔥 API CALL with tag + sort
        const res = await axios.get(
          `${Base_URL}/api/images?sort=${sort}&tag=${tag}`,
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
  }, [sort, tag]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-slate-900 text-lg">Loading images...</p>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto py-10 px-4">
      
      {/* TITLE */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Discover{" "}
        <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
          Amazing
        </span>{" "}
        Images
      </h1>
      <p className="text-gray-500 mb-6">
        Explore, like and collect your favorite images
      </p>

      {/* 🔥 FILTER BAR */}
      <FilterBar />

      {/* IMAGES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images?.map((img) => (
          <ImageCard key={img._id} image={img} />
        ))}
      </div>
    </section>
  );
}
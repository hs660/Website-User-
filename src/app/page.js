"use client";

import { useEffect, useState } from "react";
import LoginButton from "@/components/LoginButton";
import ImageCard from "@/components/ImageCard";
import LikePage from "./liked/page";
import axios from "axios"

const Base_URL= process.env.NEXT_PUBLIC_API_URL

export default function Home() {
  const [images, setImages] = useState([]);
  const [sort, setSort] = useState("newest"); // 🔥 sorting state
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, [sort]); // 🔥 sort change hone par refetch

  const fetchImages = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${Base_URL}/api/images?sort=${sort}`
      );

      setImages(Array.isArray(res.data) ? res.data : []);

    } catch (err) {
      console.error("Fetch images error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4">

        <LoginButton />

        {/* 🔽 Sorting Dropdown */}
        <div className="flex justify-between items-center mt-6">
          <h1 className="text-2xl font-bold">Image Gallery</h1>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border px-3 py-2 rounded-lg"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>

        {/* 🔄 Loader */}
        {loading ? (
          <p className="mt-10 text-center">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
            {images.map((img) => (
              <ImageCard key={img._id} image={img} />
            ))}
          </div>
        )}
        <LikePage/>
      </div>
    </section>
  );
}

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
    const getTitle = () => {

        if (sort === "popular") {
            return (
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Popular <span className="text-xl md:text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Images</span>
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Most liked images by the community
                    </p>
                </div>
            );
        }

        if (sort === "latest") {
            return (
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Latest <span className="text-xl md:text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Uploades</span>
                    </h1>
                    <p className="text-gray-500 mt-2">
                        See the newest images added recently
                    </p>
                </div>
            );
        }

        if (sort === "oldest") {
            return (
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Oldest Images
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Browse images uploaded earlier
                    </p>
                </div>
            );
        }

        return (
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    Discover <span className="text-xl md:text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Amazing</span>  Images
                </h1>
                <p className="text-gray-500 mt-2">
                    Browse amazing photos uploaded by our community
                </p>
            </div>
        );
    };
    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <p className="text-slate-900 text-lg">Loading images...</p>
            </div>
        );
    }

    return (
        <section className="max-w-7xl mx-auto py-10 px-4">
            {getTitle()}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                {/* SORT */}
                <div className="flex items-center gap-3">
                    <span className="text-gray-700 font-medium">Sort by:</span>

                    <select
                        value={selectedSort}
                        onChange={(e) => setSelectedSort(e.target.value)}
                        className="border px-3 py-2 rounded-lg focus:outline-none"
                    >
                        <option value="latest">Latest</option>
                        <option value="oldest">Oldest</option>
                        <option value="popular">Popular</option>
                    </select>
                </div>

                {/* FILTER BY TAGS */}
                <div className="flex items-center gap-3">
                    <span className="text-gray-700 font-medium">Filter by tags:</span>

                    <select
                        value={selectedTag}
                        onChange={(e) => setSelectedTag(e.target.value)}
                        className="border px-3 py-2 rounded-lg focus:outline-none"
                    >
                        <option value="all">All</option>
                        <option value="nature">Nature</option>
                        <option value="technology">Technology</option>
                        <option value="travel">Travel</option>
                        <option value="food">Food</option>
                    </select>
                </div>

                {/* REFRESH BUTTON */}
                <button
                    onClick={() => window.location.reload()}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
                >
                    Refresh
                </button>

            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                {images?.map((img) => (
                    <ImageCard key={img._id} image={img} />
                ))}

            </div>

        </section>
    );
}
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
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Popular Images
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Most liked images by the community
                    </p>
                </div>
            );
        }

        if (sort === "latest") {
            return (
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Latest Uploads
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
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-800">
                    Discover Beautiful Images
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                {images?.map((img) => (
                    <ImageCard key={img._id} image={img} />
                ))}

            </div>

        </section>
    );
}
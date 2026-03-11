"use client";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import LoginButton from "./LoginButton";
import Link from "next/link";

export default function Navbar() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">

      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Left section */}
        <div className="flex items-center gap-10">

          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Image Gallery
          </h1>

          {/* Navigation */}
          <div className="flex gap-6 text-gray-600 font-medium">

            <Link href="/" className="hover:text-red-500 transition">
              Home
            </Link>

            <Link href="/?sort=popular" className="hover:text-red-500 transition">
              Popular
            </Link>

            <Link href="/?sort=latest" className="hover:text-red-500 transition">
              Latest
            </Link>

            {user && (
              <Link href="/liked" className="hover:text-red-500 transition">
                 Liked
              </Link>
            )}

          </div>

        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">

          {user && (
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">

              <img
                src={user.photoURL}
                alt="profile"
                className="w-9 h-9 rounded-full"
              />

              <span className="text-sm font-medium hidden sm:block">
                {user.displayName}
              </span>

            </div>
          )}

          <LoginButton />

        </div>

      </div>

    </nav>
  );
}
"use client";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import LoginButton from "./LoginButton";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {

  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">

      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* Logo */}
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Image Gallery
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-gray-600 font-medium">

          <Link href="/" className="hover:text-red-500">
            Home
          </Link>

          <Link href="/?sort=popular" className="hover:text-red-500">
            Popular
          </Link>

          <Link href="/?sort=latest" className="hover:text-red-500">
            Latest
          </Link>

          {user && (
            <Link href="/liked" className="hover:text-red-500">
              Liked
            </Link>
          )}

        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">

          {user && (
            <img
              src={user.photoURL}
              alt="profile"
              className="w-9 h-9 rounded-full"
            />
          )}

          <LoginButton />

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

        </div>

      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-4 text-gray-700 font-medium">

          <Link href="/" onClick={() => setMenuOpen(false)} className="hover:text-red-500 active:text-red-500 active:scale-95 transition">
            Home
          </Link>

          <Link href="/?sort=popular" onClick={() => setMenuOpen(false)} className="hover:text-red-500 active:text-red-500 active:scale-95 transition">
            Popular
          </Link>

          <Link href="/?sort=latest" onClick={() => setMenuOpen(false)} className="hover:text-red-500 active:text-red-500 active:scale-95 transition">
            Latest
          </Link>

          {user && (
            <Link href="/liked" onClick={() => setMenuOpen(false)} className="hover:text-red-500 active:text-red-500 active:scale-95 transition">
              Liked
            </Link>
          )}

        </div>
      )}

    </nav>
  );
}
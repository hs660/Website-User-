"use client";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import LoginButton from "./LoginButton";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
 const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
const handleSearch = (e) => {
  if (e.key === "Enter" && search.trim()) {
    router.push(`/?search=${search}`);
    setMenuOpen(false); // mobile menu close
  }
};
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
        <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
          Image Gallery
        </h1>

        {/* Desktop Menu */}
        {/* 🔍 SEARCH BAR (Desktop) */}
<div className="hidden md:flex items-center border rounded-lg px-3 py-1 bg-gray-50">
  <input
    type="text"
    placeholder="Search images..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    onKeyDown={handleSearch}
    className="bg-transparent outline-none text-sm px-2"
  />
</div>
{/* 🔍 SEARCH BAR (Mobile) */}
<div className="md:hidden flex items-center border rounded-lg px-3 py-2 bg-gray-50">
  <input
    type="text"
    placeholder="Search images..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    onKeyDown={handleSearch}
    className="bg-transparent outline-none w-full"
  />
</div>
        <div className="hidden md:flex items-center gap-6 text-gray-600 font-medium">

          <Link href="/"
            className={`hover:text-red-500 ${pathname === "/" ? "text-red-500 font-semibold" : ""
              }`}
          >
            Home
          </Link>

          <Link href="/?sort=popular" 
          className="hover:text-red-500"
          >
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

          <Link href="/" onClick={() => setMenuOpen(false)} className="py-1 hover:text-red-500 active:text-red-500">
            Home
          </Link>

          <Link href="/?sort=popular" onClick={() => setMenuOpen(false)} className="py-1 hover:text-red-500 active:text-red-500">
            Popular
          </Link>

          <Link href="/?sort=latest" onClick={() => setMenuOpen(false)} className="py-1 hover:text-red-500 active:text-red-500">
            Latest
          </Link>

          {user && (
            <Link href="/liked" onClick={() => setMenuOpen(false)} className="py-1 hover:text-red-500 active:text-red-500">
              Liked
            </Link>
          )}

        </div>
      )}

    </nav>
  );
}
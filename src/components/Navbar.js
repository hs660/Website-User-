"use client";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      // Firebase logout
      await signOut(auth);

      // Remove backend token
      localStorage.removeItem("token");

      // Clear state
      setUser(null);

      // Optional: redirect to home
      router.push("/");

      console.log("User logged out successfully");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        <h1 className="text-2xl font-bold text-gray-800">
        Welcome Image Gallery Application
        </h1>

        {user ? (
          <div className="flex items-center gap-4">
            
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
              <img
                src={user.photoURL}
                alt="profile"
                className="w-9 h-9 rounded-full object-cover border"
              />
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {user.displayName}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-600 transition duration-300 shadow-sm"
            >
              Logout
            </button>
          </div>
        ) : (
          <button className="text-gray-500 text-sm">
            Not Logged In
          </button>
        )}
      </div>
    </nav>
  );
}
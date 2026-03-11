"use client";

import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { auth, provider } from "@/lib/firebase";
import { useEffect, useState } from "react";

export default function LoginButton() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      localStorage.setItem("token", token);
    } catch (error) {
      console.error("Login error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    localStorage.removeItem("token");
  };

  if (user) {
    return (
      <button
        onClick={handleLogout}
        className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-600"
      >
        Logout
      </button>
    );
  }

  return (
    <button
      onClick={handleLogin}
      className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-600"
    >
      Login with Google
    </button>
  );
}
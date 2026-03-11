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
    if (loading) return; // prevent multiple clicks
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

  // const handleLogout = async () => {
  //   await auth.signOut();
  // };

  return (
    <div style={{ marginBottom: "20px" }}>
      {user ? (
        <>
          <p className="text-xl">Welcome <span className="font-bold">{user.displayName}</span></p>
        </>
      ) : (
        <div className="flex">
        <h1 className="text-slate-600 text-sm md:text-2xl mr-12">
        Create Account with Google 
        </h1>
        <button className="bg-blue-500 p-1 md:p-2 rounded-2xl w-22 text-white hover:bg-blue-700" onClick={handleLogin}>Login</button>
        </div>
      )}
    </div>
  );
}
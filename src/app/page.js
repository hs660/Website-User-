"use client";

import { Suspense } from "react";
import HomeContent from "../components/HomeContent.js";

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <HomeContent />
    </Suspense>
  );
}
"use client";

import { Loader2 } from "lucide-react";

export default function ProjectLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center min-h-[500px]">
      <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
    </div>
  );
}

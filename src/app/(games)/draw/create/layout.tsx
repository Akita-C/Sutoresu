"use client";

import Squares from "@/components/react-bits/Squares";
import { AuthGuard } from "@/features/auth/components";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <AuthGuard fallback={<div></div>}>
      <div className="h-screen w-screen">
        <Squares
          speed={0.5}
          squareSize={40}
          direction="diagonal"
          borderColor="#4C1EB8"
          hoverFillColor="#fff"
          className="relative"
        />
        <div className="absolute top-1/6 left-1/2 -translate-x-1/2">{children}</div>
      </div>
    </AuthGuard>
  );
}

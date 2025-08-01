"use client";

import Squares from "@/components/react-bits/Squares";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-screen">
      <Squares
        speed={0.5}
        squareSize={40}
        direction="diagonal" // up, down, left, right, diagonal
        borderColor="#4C1EB8"
        hoverFillColor="#fff"
        className="relative"
      />
      {children}
    </div>
  );
}

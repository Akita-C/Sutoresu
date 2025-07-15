"use client";

import Squares from "@/components/react-bits/Squares/Squares";
import { HomeHeader } from "../components";

export default function HomePage() {
  return (
    <div className="h-screen w-screen">
      <HomeHeader />

      <Squares
        speed={0.5}
        squareSize={40}
        direction="diagonal"
        borderColor="#4C1EB8"
        hoverFillColor="#fff"
        className="relative"
      />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Akita</h1>
          <p className="text-lg text-muted-foreground">Your learning adventure starts here</p>
        </div>
      </div>
    </div>
  );
}

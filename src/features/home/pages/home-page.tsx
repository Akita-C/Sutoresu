"use client";

import Squares from "@/components/react-bits/Squares/Squares";
import { HomeHeader } from "../components";
import { MorphingText } from "@/components/magicui/morphing-text";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";

export default function HomePage() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
          <MorphingText texts={["Ready", "To", "Draw"]} />
          <div className="mt-4 flex flex-col gap-2">
            <InteractiveHoverButton
              disabled={isLoading}
              onClick={() => router.push("/draw/create")}
            >
              Create Room
            </InteractiveHoverButton>
            <Input
              disabled={isLoading}
              placeholder="Enter room code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="rounded-full"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setIsLoading(true);
                  router.push(`/draw/room/${roomCode}`);
                  setIsLoading(false);
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

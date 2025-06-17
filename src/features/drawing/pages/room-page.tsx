"use client";

import SpringButton from "@/components/common/spring-button/spring-button";
import ShinyText from "@/components/react-bits/ShinyText/ShinyText";
import PlayerAvatar from "@/features/drawing/components/player-avatar";

export default function RoomPage() {
  return (
    <div>
      <div className="flex justify-center items-center py-8">
        <ShinyText text="Sketch & Guess Showdown!" speed={8} className="font-bold text-4xl" />
      </div>
      <div className="flex flex-wrap justify-center gap-4 max-w-[400px] mx-auto">
        <PlayerAvatar src="https://github.com/shadcn.png" fallback="CN" />
        <PlayerAvatar src="https://github.com/shadcn.png" fallback="CN" />
        <PlayerAvatar src="https://github.com/shadcn.png" fallback="CN" />
        <PlayerAvatar src="https://github.com/shadcn.png" fallback="CN" />
        <PlayerAvatar src="https://github.com/shadcn.png" fallback="CN" />
        <PlayerAvatar src="https://github.com/shadcn.png" fallback="CN" />
        <PlayerAvatar src="https://github.com/shadcn.png" fallback="CN" />
        <PlayerAvatar src="https://github.com/shadcn.png" fallback="CN" />
        <PlayerAvatar src="https://github.com/shadcn.png" fallback="CN" />
        <PlayerAvatar src="https://github.com/shadcn.png" fallback="CN" />
        <PlayerAvatar src="https://github.com/shadcn.png" fallback="CN" />
      </div>
      <div className="flex justify-center items-center py-8">
        <SpringButton>Start Game</SpringButton>
      </div>
    </div>
  );
}

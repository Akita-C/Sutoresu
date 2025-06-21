import SpringButton from "@/components/common/spring-button/spring-button";
import ShinyText from "@/components/react-bits/ShinyText/ShinyText";
import { Skeleton } from "@/components/ui/skeleton";

export default function DrawRoomPageSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center items-center py-8">
        <ShinyText text="Sketch & Guess Showdown!" speed={8} className="font-bold text-4xl" />
      </div>
      <div className="flex flex-wrap justify-center gap-4 max-w-[400px] mx-auto">
        {Array.from({ length: 10 }).map((_, index) => (
          <Skeleton key={index} className="w-10 h-10 rounded-full" />
        ))}
      </div>
      <div className="flex justify-center items-center py-8">
        <SpringButton>Start Game</SpringButton>
      </div>
    </div>
  );
}

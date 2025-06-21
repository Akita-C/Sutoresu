import DrawRoomPage from "@/features/drawing/pages/draw-room-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Draw Room",
  description: "Draw with your friends",
  keywords: ["draw", "room", "friends"],
};

interface PageProps {
  params: Promise<{ roomId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { roomId } = await params;
  return <DrawRoomPage roomId={roomId} />;
}

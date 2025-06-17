import RoomPage from "@/features/drawing/pages/room-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Draw Room",
  description: "Draw with your friends",
  keywords: ["draw", "room", "friends"],
};

export default function Page() {
  return <RoomPage />;
}

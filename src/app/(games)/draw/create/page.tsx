import { DrawCreatePage } from "@/features/drawing/pages";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Draw Room",
  description: "Create a new draw room",
};

export default function Page() {
  return <DrawCreatePage />;
}

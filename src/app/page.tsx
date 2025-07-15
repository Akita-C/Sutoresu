import HomePage from "@/features/home/pages/home-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Home page",
};

export default function Page() {
  return <HomePage />;
}

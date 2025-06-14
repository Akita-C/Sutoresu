import { ProfilePage } from "@/components/profile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile Settings",
  description: "Manage your profile information",
};

export default function Page() {
  return <ProfilePage />;
}

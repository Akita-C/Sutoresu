import type { Metadata } from "next";
import { MyQuizzesClient } from "@/components/quiz/my-quizzes/my-quizzes-client";

export const metadata: Metadata = {
  title: "My Quizzes | Sutoresu",
  description: "Manage and organize your personal quiz collection. Create, edit, and delete your quizzes.",
  keywords: ["quiz", "my quizzes", "quiz management", "personal quizzes", "quiz creator"],
  openGraph: {
    title: "My Quizzes | Sutoresu",
    description: "Manage and organize your personal quiz collection",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "My Quizzes | Sutoresu",
    description: "Manage and organize your personal quiz collection",
  },
};

export default function MyQuizzesPage() {
  return <MyQuizzesClient />;
}

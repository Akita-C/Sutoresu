import { Metadata } from "next";
import { QuizEditClient } from "@/components/quiz/quiz-edit/quiz-edit-client";

export const metadata: Metadata = {
  title: "Edit Quiz | Sutoresu",
  description: "Edit your quiz questions and settings",
};

interface QuizEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function QuizEditPage({ params }: QuizEditPageProps) {
  const { id } = await params;

  return <QuizEditClient quizId={id} />;
}

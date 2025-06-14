import { Metadata } from "next";
import { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: {
    template: "%s | Sutoresu",
    default: "Quizzes | Sutoresu",
  },
  description:
    "Browse, create and take interactive quizzes on Sutoresu learning platform.",
};

export default function QuizzesLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-background">
      {/* React 19: Document Metadata - có thể render metadata trong layout */}
      <meta name="theme-color" content="#ffffff" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />

      {children}
    </div>
  );
}

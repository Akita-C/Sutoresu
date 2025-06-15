import { QuestionType } from "@/lib/api/generated";
import { LocalQuestion } from "./types";

export function createNewQuestion(questionData: Partial<LocalQuestion>, currentQuestionsLength: number): LocalQuestion {
  return {
    id: `temp-${Date.now()}`,
    content: questionData.content || "",
    questionType: questionData.questionType || QuestionType.NUMBER_1,
    timeLimitInSeconds: questionData.timeLimitInSeconds || 30,
    points: questionData.points || 10,
    configuration: questionData.configuration || "",
    explanation: questionData.explanation || "",
    order: currentQuestionsLength,
    isNew: true,
  };
}

export function updateQuestionInList(questions: LocalQuestion[], updatedQuestion: LocalQuestion): LocalQuestion[] {
  return questions.map((q) =>
    q.id === updatedQuestion.id ? { ...updatedQuestion, isModified: !updatedQuestion.isNew } : q,
  );
}

export function removeQuestionFromList(questions: LocalQuestion[], questionId: string): LocalQuestion[] {
  return questions.filter((q) => q.id !== questionId);
}

export function getChangedQuestions(questions: LocalQuestion[]): LocalQuestion[] {
  return questions.filter((q) => q.isNew || q.isModified);
}

export function resetQuestionStates(questions: LocalQuestion[]): LocalQuestion[] {
  return questions.map((q) => ({
    ...q,
    isNew: false,
    isModified: false,
  }));
}

export function prepareBulkRequest(quizId: string, questions: LocalQuestion[]) {
  return {
    quizId,
    questions: questions.map((q) => ({
      content: q.content,
      questionType: q.questionType,
      timeLimitInSeconds: q.timeLimitInSeconds,
      points: q.points,
      configuration: q.configuration,
      explanation: q.explanation,
      order: q.order,
    })),
  };
}

export function getQuestionTypeLabel(type: QuestionType): string {
  switch (type) {
    case QuestionType.NUMBER_1:
      return "Multiple Choice";
    case QuestionType.NUMBER_2:
      return "True/False";
    case QuestionType.NUMBER_3:
      return "Fill in the Blank";
    case QuestionType.NUMBER_4:
      return "Matching";
    case QuestionType.NUMBER_5:
      return "Ordering";
    default:
      return "Unknown";
  }
}

export function getQuestionTypeColor(type: QuestionType): string {
  switch (type) {
    case QuestionType.NUMBER_1:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    case QuestionType.NUMBER_2:
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case QuestionType.NUMBER_3:
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
    case QuestionType.NUMBER_4:
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
    case QuestionType.NUMBER_5:
      return "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
}

export const questionTypeOptions = [
  { value: QuestionType.NUMBER_1, label: "Multiple Choice" },
  { value: QuestionType.NUMBER_2, label: "True/False" },
  { value: QuestionType.NUMBER_3, label: "Fill in the Blank" },
  { value: QuestionType.NUMBER_4, label: "Matching" },
  { value: QuestionType.NUMBER_5, label: "Ordering" },
];

export function validateQuestion(question: LocalQuestion): string[] {
  const errors: string[] = [];

  if (!question.content?.trim()) {
    errors.push("Question content is required");
  }

  if (!question.configuration) {
    errors.push("Question configuration is required");
  }

  // Type-specific validation
  try {
    const config = JSON.parse(question.configuration || "{}");

    switch (question.questionType) {
      case QuestionType.NUMBER_1: // Multiple Choice
        if (!config.options || config.options.length < 2) {
          errors.push("Multiple choice questions need at least 2 options");
        }
        if (!config.correctAnswerIndices || config.correctAnswerIndices.length === 0) {
          errors.push("Please select at least one correct answer");
        }
        break;

      case QuestionType.NUMBER_3: // Fill in the Blank
        if (!config.textWithBlanks || !config.textWithBlanks.includes("[blank")) {
          errors.push("Fill in the blank questions need text with [blank] markers");
        }
        break;

      case QuestionType.NUMBER_4: // Matching
        if (!config.leftItems || config.leftItems.length === 0) {
          errors.push("Matching questions need left items");
        }
        if (!config.rightItems || config.rightItems.length === 0) {
          errors.push("Matching questions need right items");
        }
        if (!config.correctMatches || config.correctMatches.length === 0) {
          errors.push("Matching questions need correct matches");
        }
        break;

      case QuestionType.NUMBER_5: // Ordering
        if (!config.items || config.items.length < 2) {
          errors.push("Ordering questions need at least 2 items");
        }
        break;
    }
  } catch {
    errors.push("Invalid question configuration");
  }

  return errors;
}

export function updateQuestionsOrder(questions: LocalQuestion[]): LocalQuestion[] {
  return questions.map((question, index) => ({
    ...question,
    order: index,
  }));
}

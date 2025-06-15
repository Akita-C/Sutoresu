import { CreateQuestionItem, QuestionType } from "@/lib/api/generated";

export interface LocalQuestion extends Omit<CreateQuestionItem, "questionType"> {
  id: string;
  questionType: QuestionType;
  isNew?: boolean;
  isModified?: boolean;
}

// Question Configuration Types
export interface MultipleChoiceConfig {
  options: Option[];
  correctAnswerIndices: number[];
  allowMultipleSelection: boolean;
  shuffleOptions: boolean;
}

export interface Option {
  text: string;
  imageUrl?: string;
}

export interface TrueFalseConfig {
  correctAnswer: boolean;
  trueLabel?: string;
  falseLabel?: string;
}

export interface FillInTheBlankConfig {
  textWithBlanks: string;
  blanks: BlankAnswer[];
  caseSensitive: boolean;
  trimWhitespace: boolean;
}

export interface BlankAnswer {
  acceptedAnswers: string[];
  position: number;
}

export interface MatchingConfig {
  leftItems: MatchItem[];
  rightItems: MatchItem[];
  correctMatches: MatchPair[];
  shuffleItems: boolean;
}

export interface MatchItem {
  id: string;
  text: string;
  imageUrl?: string;
}

export interface MatchPair {
  leftId: string;
  rightId: string;
}

export interface OrderingConfig {
  items: OrderItem[];
  correctOrder: string[];
  showNumbers: boolean;
}

export interface OrderItem {
  id: string;
  text: string;
  imageUrl?: string;
}

export type QuestionConfig =
  | MultipleChoiceConfig
  | TrueFalseConfig
  | FillInTheBlankConfig
  | MatchingConfig
  | OrderingConfig;

"use client";

import { useState, useEffect } from "react";
import { QuestionType } from "@/lib/api/generated";
import {
  QuestionConfig,
  MultipleChoiceConfig,
  TrueFalseConfig,
  FillInTheBlankConfig,
  MatchingConfig,
  OrderingConfig,
} from "./types";

import { MultipleChoiceEditor } from "./config-editors/multiple-choice-editor";
import { TrueFalseEditor } from "./config-editors/true-false-editor";
import { MatchingEditor } from "./config-editors/matching-editor";
import { OrderingEditor } from "./config-editors/ordering-editor";
import { FillInBlankEditor } from "./config-editors/fill-in-blank-editor";

interface QuestionConfigEditorProps {
  questionType: QuestionType;
  value: string;
  onChange: (value: string) => void;
}

export function QuestionConfigEditor({ questionType, value, onChange }: QuestionConfigEditorProps) {
  const [config, setConfig] = useState<QuestionConfig | null>(null);

  useEffect(() => {
    if (value) {
      try {
        setConfig(JSON.parse(value) as QuestionConfig);
      } catch {
        setConfig(getDefaultConfig(questionType));
      }
    } else {
      setConfig(getDefaultConfig(questionType));
    }
  }, [value, questionType]);

  useEffect(() => {
    if (config) {
      onChange(JSON.stringify(config));
    }
  }, [config, onChange]);

  const handleConfigChange = <T extends QuestionConfig>(updates: Partial<T>) => {
    if (config) {
      setConfig({ ...config, ...updates } as QuestionConfig);
    }
  };

  function getDefaultConfig(type: QuestionType): QuestionConfig {
    switch (type) {
      case QuestionType.NUMBER_1:
        return {
          options: [{ text: "" }, { text: "" }],
          correctAnswerIndices: [0],
          allowMultipleSelection: false,
          shuffleOptions: true,
        } as MultipleChoiceConfig;

      case QuestionType.NUMBER_2:
        return {
          correctAnswer: true,
          trueLabel: "True",
          falseLabel: "False",
        } as TrueFalseConfig;

      case QuestionType.NUMBER_3:
        return {
          textWithBlanks: "The capital of France is [_____].",
          blanks: [{ acceptedAnswers: ["Paris"], position: 0 }],
          caseSensitive: false,
          trimWhitespace: true,
        } as FillInTheBlankConfig;

      case QuestionType.NUMBER_4:
        return {
          leftItems: [{ id: "1", text: "" }],
          rightItems: [{ id: "1", text: "" }],
          correctMatches: [{ leftId: "1", rightId: "1" }],
          shuffleItems: true,
        } as MatchingConfig;

      case QuestionType.NUMBER_5:
        return {
          items: [
            { id: "1", text: "" },
            { id: "2", text: "" },
          ],
          correctOrder: ["1", "2"],
          showNumbers: true,
        } as OrderingConfig;

      default:
        return {
          options: [{ text: "" }, { text: "" }],
          correctAnswerIndices: [0],
          allowMultipleSelection: false,
          shuffleOptions: true,
        } as MultipleChoiceConfig;
    }
  }

  if (!config) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Loading configuration...</p>
      </div>
    );
  }

  switch (questionType) {
    case QuestionType.NUMBER_1:
      return <MultipleChoiceEditor config={config as MultipleChoiceConfig} onChange={handleConfigChange} />;
    case QuestionType.NUMBER_2:
      return <TrueFalseEditor config={config as TrueFalseConfig} onChange={handleConfigChange} />;
    case QuestionType.NUMBER_3:
      return <FillInBlankEditor config={config as FillInTheBlankConfig} onChange={handleConfigChange} />;
    case QuestionType.NUMBER_4:
      return <MatchingEditor config={config as MatchingConfig} onChange={handleConfigChange} />;
    case QuestionType.NUMBER_5:
      return <OrderingEditor config={config as OrderingConfig} onChange={handleConfigChange} />;
    default:
      return (
        <div className="text-center py-8 text-muted-foreground">
          <p>Please select a question type to configure options</p>
        </div>
      );
  }
}

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import { FillInTheBlankConfig, BlankAnswer } from "../types";

interface FillInBlankEditorProps {
  config: FillInTheBlankConfig;
  onChange: (config: FillInTheBlankConfig) => void;
}

export function FillInBlankEditor({ config, onChange }: FillInBlankEditorProps) {
  const updateTextWithBlanks = (text: string) => {
    onChange({ ...config, textWithBlanks: text });
  };

  const addBlankAnswer = (position: number) => {
    const existingBlank = config.blanks.find((blank) => blank.position === position);

    if (existingBlank) {
      const updatedBlanks = config.blanks.map((blank) =>
        blank.position === position ? { ...blank, acceptedAnswers: [...blank.acceptedAnswers, ""] } : blank,
      );
      onChange({ ...config, blanks: updatedBlanks });
    } else {
      const newBlank: BlankAnswer = {
        position,
        acceptedAnswers: [""],
      };
      onChange({ ...config, blanks: [...config.blanks, newBlank] });
    }
  };

  const updateBlankAnswer = (position: number, answerIndex: number, value: string) => {
    const updatedBlanks = config.blanks.map((blank) =>
      blank.position === position
        ? {
            ...blank,
            acceptedAnswers: blank.acceptedAnswers.map((answer, idx) => (idx === answerIndex ? value : answer)),
          }
        : blank,
    );
    onChange({ ...config, blanks: updatedBlanks });
  };

  const removeBlankAnswer = (position: number, answerIndex: number) => {
    const updatedBlanks = config.blanks
      .map((blank) =>
        blank.position === position
          ? {
              ...blank,
              acceptedAnswers: blank.acceptedAnswers.filter((_, idx) => idx !== answerIndex),
            }
          : blank,
      )
      .filter((blank) => blank.acceptedAnswers.length > 0);

    onChange({ ...config, blanks: updatedBlanks });
  };

  const getBlankPositions = () => {
    const regex = /\[blank(\d+)\]/g;
    const positions: number[] = [];
    let match;

    while ((match = regex.exec(config.textWithBlanks)) !== null) {
      positions.push(parseInt(match[1]));
    }

    return [...new Set(positions)].sort((a, b) => a - b);
  };

  const blankPositions = getBlankPositions();

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="text-with-blanks" className="text-sm font-medium">
          Text with Blanks
        </Label>
        <Textarea
          id="text-with-blanks"
          value={config.textWithBlanks}
          onChange={(e) => updateTextWithBlanks(e.target.value)}
          placeholder="Enter text with blanks like: The capital of France is [blank1] and it has [blank2] million people."
          className="mt-1 min-h-[80px]"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Use [blank1], [blank2], etc. to create blanks. Numbers can be any positive integer.
        </p>
      </div>

      {blankPositions.length > 0 && (
        <div>
          <Label className="text-sm font-medium">Blank Answers</Label>
          <div className="space-y-3 mt-2">
            {blankPositions.map((position) => {
              const blank = config.blanks.find((b) => b.position === position);
              return (
                <div key={position} className="border rounded-lg p-3 bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">Blank {position}</Badge>
                    <Button type="button" variant="outline" size="sm" onClick={() => addBlankAnswer(position)}>
                      <Plus className="h-3 w-3 mr-1" />
                      Add Answer
                    </Button>
                  </div>

                  {blank?.acceptedAnswers.map((answer, answerIndex) => (
                    <div key={answerIndex} className="flex items-center gap-2 mb-2">
                      <Input
                        value={answer}
                        onChange={(e) => updateBlankAnswer(position, answerIndex, e.target.value)}
                        placeholder="Acceptable answer"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBlankAnswer(position, answerIndex)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {!blank && <p className="text-sm text-muted-foreground">No answers defined for this blank.</p>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 pt-4 border-t">
        <div className="flex items-center justify-between">
          <Label htmlFor="case-sensitive" className="text-sm">
            Case sensitive matching
          </Label>
          <Switch
            id="case-sensitive"
            checked={config.caseSensitive}
            onCheckedChange={(checked) => onChange({ ...config, caseSensitive: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="trim-whitespace" className="text-sm">
            Trim whitespace from answers
          </Label>
          <Switch
            id="trim-whitespace"
            checked={config.trimWhitespace}
            onCheckedChange={(checked) => onChange({ ...config, trimWhitespace: checked })}
          />
        </div>
      </div>
    </div>
  );
}

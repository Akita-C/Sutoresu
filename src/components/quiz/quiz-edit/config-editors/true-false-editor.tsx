"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TrueFalseConfig } from "../types";

interface TrueFalseEditorProps {
  config: TrueFalseConfig;
  onChange: (config: TrueFalseConfig) => void;
}

export function TrueFalseEditor({ config, onChange }: TrueFalseEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Correct Answer</Label>
        <RadioGroup
          value={config.correctAnswer.toString()}
          onValueChange={(value) => onChange({ ...config, correctAnswer: value === "true" })}
          className="mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="true" />
            <Label htmlFor="true">True</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="false" />
            <Label htmlFor="false">False</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="true-label" className="text-sm">
            True Label (Optional)
          </Label>
          <Input
            id="true-label"
            value={config.trueLabel || ""}
            onChange={(e) => onChange({ ...config, trueLabel: e.target.value || "True" })}
            placeholder="True"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="false-label" className="text-sm">
            False Label (Optional)
          </Label>
          <Input
            id="false-label"
            value={config.falseLabel || ""}
            onChange={(e) => onChange({ ...config, falseLabel: e.target.value || "False" })}
            placeholder="False"
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
}

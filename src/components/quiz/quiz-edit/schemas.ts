import { z } from "zod";
import { QuestionType } from "@/lib/api/generated";

export const questionFormSchema = z.object({
  content: z.string().min(1, "Question content is required"),
  questionType: z.nativeEnum(QuestionType),
  timeLimitInSeconds: z.number().min(5).max(300),
  points: z.number().min(1).max(100),
  explanation: z.string().optional(),
  configuration: z.string().optional(),
});

export type QuestionFormData = z.infer<typeof questionFormSchema>;

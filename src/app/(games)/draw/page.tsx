import { Metadata } from "next";
import { DrawingCanvas } from "@/features/drawing/components/drawing-canvas";
import { DrawingToolbar } from "@/features/drawing/components/drawing-toolbar";

export const metadata: Metadata = {
  title: "Drawing Canvas - Sutoresu",
  description: "Interactive drawing canvas similar to Skribbl.io",
};

export default function DrawPage() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Drawing Canvas</h1>
        <p className="text-muted-foreground">Create your masterpiece with our interactive drawing tools</p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <DrawingToolbar />
        <DrawingCanvas width={800} height={600} className="shadow-lg" />
      </div>
    </div>
  );
}

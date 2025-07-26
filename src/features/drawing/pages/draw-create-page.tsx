import DrawCreateForm from "../components/draw-create-form";
import { SparklesText } from "@/components/magicui/sparkles-text";

export default function DrawCreatePage() {
  return (
    <div className="grid grid-cols-2 gap-20">
      <div className="flex flex-col justify-center items-center py-8">
        <SparklesText>Create Room</SparklesText>
        <p className="text-sm text-muted-foreground">
          Create a room to draw and guess with your friends
        </p>
      </div>
      <DrawCreateForm />
    </div>
  );
}

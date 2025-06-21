import ShinyText from "@/components/react-bits/ShinyText/ShinyText";
import DrawCreateForm from "../components/draw-create-form";

export default function DrawCreatePage() {
  return (
    <div className="grid grid-cols-2 gap-20">
      <div className="flex justify-center items-center py-8">
        <ShinyText text="Create Draw Room" speed={8} className="font-bold text-4xl" />
      </div>
      <DrawCreateForm />
    </div>
  );
}

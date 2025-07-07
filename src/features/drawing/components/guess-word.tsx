import { useDrawGameStore } from "../stores/draw-game-store";

export default function GuessWord() {
  const { currentWord } = useDrawGameStore();
  return (
    <div className="w-full bg-card/40 rounded-lg flex justify-center items-center">
      <span className="font-mono font-bold tracking-[0.5em] text-center">{currentWord}</span>
    </div>
  );
}

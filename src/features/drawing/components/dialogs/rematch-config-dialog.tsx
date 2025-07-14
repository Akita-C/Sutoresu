"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Clock, GamepadIcon, Loader2, Timer, Users } from "lucide-react";
import { CreateDrawRoomRequest } from "../../types";

const rematchConfigSchema = z.object({
  maxPlayers: z.number().min(2, "Minimum 2 players").max(10, "Maximum 10 players"),
  maxRoundPerPlayers: z
    .number()
    .min(1, "Minimum 1 round per player")
    .max(4, "Maximum 4 rounds per player"),
  drawingDurationSeconds: z.number().min(30, "Minimum 30 seconds").max(180, "Maximum 180 seconds"),
  guessingDurationSeconds: z.number().min(20, "Minimum 20 seconds").max(120, "Maximum 120 seconds"),
  revealDurationSeconds: z.number().min(10, "Minimum 10 seconds").max(60, "Maximum 60 seconds"),
  maxWordRevealPercentage: z.number().min(0, "Minimum 0%").max(1, "Maximum 100%"),
});

type RematchConfigSchema = z.infer<typeof rematchConfigSchema>;

interface RematchConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (config: CreateDrawRoomRequest["config"]) => void;
  isLoading?: boolean;
}

export default function RematchConfigDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: RematchConfigDialogProps) {
  const form = useForm<RematchConfigSchema>({
    resolver: zodResolver(rematchConfigSchema),
    defaultValues: {
      maxPlayers: 4,
      maxRoundPerPlayers: 2,
      drawingDurationSeconds: 60,
      guessingDurationSeconds: 40,
      revealDurationSeconds: 15,
      maxWordRevealPercentage: 0.6,
    },
  });

  const handleSubmit = (data: RematchConfigSchema) => {
    const config: CreateDrawRoomRequest["config"] = {
      maxPlayers: data.maxPlayers,
      maxRoundPerPlayers: data.maxRoundPerPlayers,
      drawingDurationSeconds: data.drawingDurationSeconds,
      guessingDurationSeconds: data.guessingDurationSeconds,
      revealDurationSeconds: data.revealDurationSeconds,
      maxWordRevealPercentage: data.maxWordRevealPercentage,
      wordRevealIntervalSeconds: 5,
      enableWordReveal: true,
    };

    onSubmit(config);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">🎮 Rematch Settings</DialogTitle>
          <DialogDescription>Configure the settings for your rematch game</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Section 1: Round Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <GamepadIcon className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Round Settings</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="maxPlayers"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="flex items-center gap-2">
                        <Users className="size-4" />
                        Players: {field.value}
                      </FormLabel>
                      <FormControl>
                        <Slider
                          min={2}
                          max={10}
                          step={1}
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                          disabled={isLoading}
                          className="w-full"
                        />
                      </FormControl>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>2</span>
                        <span>10</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxRoundPerPlayers"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Rounds/Player: {field.value}
                      </FormLabel>
                      <FormControl>
                        <Slider
                          min={1}
                          max={4}
                          step={1}
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                          disabled={isLoading}
                          className="w-full"
                        />
                      </FormControl>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>1</span>
                        <span>4</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxWordRevealPercentage"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Word Reveal: {Math.round(field.value * 100)}%</FormLabel>
                      <FormControl>
                        <Slider
                          min={0}
                          max={1}
                          step={0.1}
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                          disabled={isLoading}
                          className="w-full"
                        />
                      </FormControl>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>0%</span>
                        <span>100%</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Section 2: Time Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Timer className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Time Settings</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="drawingDurationSeconds"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Drawing: {field.value}s</FormLabel>
                      <FormControl>
                        <Slider
                          min={30}
                          max={180}
                          step={10}
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                          disabled={isLoading}
                          className="w-full"
                        />
                      </FormControl>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>30s</span>
                        <span>180s</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="guessingDurationSeconds"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Guessing: {field.value}s</FormLabel>
                      <FormControl>
                        <Slider
                          min={20}
                          max={120}
                          step={10}
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                          disabled={isLoading}
                          className="w-full"
                        />
                      </FormControl>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>20s</span>
                        <span>120s</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="revealDurationSeconds"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Reveal: {field.value}s</FormLabel>
                      <FormControl>
                        <Slider
                          min={10}
                          max={60}
                          step={5}
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                          disabled={isLoading}
                          className="w-full"
                        />
                      </FormControl>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>10s</span>
                        <span>60s</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Starting Rematch...
                  </>
                ) : (
                  "Start Rematch"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

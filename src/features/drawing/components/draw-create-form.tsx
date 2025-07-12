"use client";

import { useRouter } from "next/navigation";
import z from "zod";
import { useCreateDrawRoomMutation } from "../hooks/use-draw-mutations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateDrawRoomRequest } from "../types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Clock, Loader2, Users, GamepadIcon, Timer } from "lucide-react";
import SpringButton from "@/components/common/spring-button/spring-button";
import { Separator } from "@/components/ui/separator";

const createRoomSchema = z.object({
  roomName: z
    .string()
    .min(1, "Room name is required")
    .min(3, "Room name must be less than 3 characters")
    .max(50, "Room name must be less than 50 characters"),
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
type CreateRoomSchema = z.infer<typeof createRoomSchema>;

export default function DrawCreateForm() {
  const router = useRouter();
  const { mutate: createDrawRoom, isPending } = useCreateDrawRoomMutation();

  const form = useForm<CreateRoomSchema>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      roomName: "",
      maxPlayers: 2,
      maxRoundPerPlayers: 1,
      drawingDurationSeconds: 30,
      guessingDurationSeconds: 20,
      revealDurationSeconds: 10,
      maxWordRevealPercentage: 0.6,
    },
  });

  const onSubmit = (data: CreateRoomSchema) => {
    const request: CreateDrawRoomRequest = {
      roomName: data.roomName,
      config: {
        maxPlayers: data.maxPlayers,
        maxRoundPerPlayers: data.maxRoundPerPlayers,
        drawingDurationSeconds: data.drawingDurationSeconds,
        guessingDurationSeconds: data.guessingDurationSeconds,
        revealDurationSeconds: data.revealDurationSeconds,
        maxWordRevealPercentage: data.maxWordRevealPercentage,
        wordRevealIntervalSeconds: 5, // Temp: Default value
        enableWordReveal: true, // Temp: Default value
      },
    };

    createDrawRoom(request, {
      onSuccess: (response) => {
        if (response.success && response.data) {
          router.push(`/draw/room/${response.data}`);
        }
      },
    });
  };

  return (
    <Card className="min-w-[500px]">
      <CardHeader>
        <CardTitle>Room Settings</CardTitle>
        <CardDescription>Set up your drawing room with custom settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Section 1: Room Name */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="roomName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter room name" {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Section 2: Round Settings */}
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
                          disabled={isPending}
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
                          disabled={isPending}
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
                          disabled={isPending}
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

            {/* Section 3: Time Settings */}
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
                          disabled={isPending}
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
                          disabled={isPending}
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
                          disabled={isPending}
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

            <div className="flex justify-center pt-4">
              <SpringButton type="submit" disabled={isPending} className="w-full h-10">
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating Room...
                  </>
                ) : (
                  "Create Room"
                )}
              </SpringButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

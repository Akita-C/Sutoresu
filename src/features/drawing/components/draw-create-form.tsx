"use client";

import { useRouter } from "next/navigation";
import z from "zod";
import { useCreateDrawRoomMutation } from "../hooks/use-draw-mutations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateDrawRoomRequest } from "../types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Clock, Loader2, Users } from "lucide-react";
import SpringButton from "@/components/common/spring-button/spring-button";

const createRoomSchema = z.object({
  roomName: z
    .string()
    .min(1, "Room name is required")
    .min(3, "Room name must be less than 3 characters")
    .max(50, "Room name must be less than 50 characters"),
  maxPlayers: z.number().min(2, "Minimum 2 players").max(10, "Maximum 10 players"),
  maxRoundPerPlayers: z.number().min(1, "Minimum 1 round per player").max(4, "Maximum 4 rounds per player"),
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
    },
  });

  const onSubmit = (data: CreateRoomSchema) => {
    const request: CreateDrawRoomRequest = {
      roomName: data.roomName,
      config: {
        maxPlayers: data.maxPlayers,
        maxRoundPerPlayers: data.maxRoundPerPlayers,
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
    <Card>
      <CardHeader>
        <CardTitle>Room Settings</CardTitle>
        <CardDescription>Set up your drawing room with custom settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="roomName"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Room Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter room name" {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxPlayers"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>
                    <Users className="size-4" />
                    Maximum Players
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={2}
                      max={10}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      disabled={isPending}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxRoundPerPlayers"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Rounds Per Player
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={4}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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

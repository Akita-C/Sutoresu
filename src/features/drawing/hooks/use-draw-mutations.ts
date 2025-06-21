import { useMutation } from "@tanstack/react-query";
import { CreateDrawRoomRequest } from "../types";
import { drawService } from "../services/draw-service";
import { toast } from "sonner";

export const useCreateDrawRoomMutation = () => {
  return useMutation({
    mutationFn: (request: CreateDrawRoomRequest) => drawService.createDrawRoom(request),
    onSuccess: (response) => {
      if (response.success && response.data) {
        toast.success(response.message || "Draw room created successfully");
      } else {
        toast.error(response.message || "Failed to create draw room");
      }
    },
    onError: (error) => {
      toast.error("Failed to create draw room");
      console.error("Create draw room error:", error);
    },
  });
};

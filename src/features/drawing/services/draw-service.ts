import { apiClient, DrawGameApi } from "@/lib/api";
import { BaseService } from "@/lib/services";
import { CreateDrawRoomRequest, DrawPlayer, DrawRoom } from "../types";
import { ServiceResponse } from "@/lib/types";

export class DrawService extends BaseService {
  private drawApi: DrawGameApi;

  constructor() {
    super();
    this.drawApi = new DrawGameApi(
      apiClient.getConfiguration(),
      undefined,
      apiClient.getAxiosInstance(),
    );
  }

  async createDrawRoom(request: CreateDrawRoomRequest): Promise<ServiceResponse<string>> {
    try {
      const response = await this.drawApi.apiV1DrawGameCreatePost(
        request.roomName,
        request.theme,
        request.config.maxPlayers,
        request.config.maxRoundPerPlayers,
        request.config.drawingDurationSeconds,
        request.config.guessingDurationSeconds,
        request.config.revealDurationSeconds,
        request.config.wordRevealIntervalSeconds,
        request.config.maxWordRevealPercentage,
        request.config.enableWordReveal,
      );

      if (response.data.success && response.data.data) {
        return this.createSuccessResponse(
          response.data.data,
          response.data.message || "Draw room created successfully",
        );
      }

      return this.createErrorResponse(
        response.data.message || "Failed to create draw room",
        response.data.errors || [],
      );
    } catch (error) {
      return this.handleError(error, "Failed to get questions");
    }
  }

  async getDrawRoom(roomId: string): Promise<ServiceResponse<DrawRoom>> {
    try {
      const response = await this.drawApi.apiV1DrawGameRoomRoomIdGet(roomId);
      if (response.data.success && response.data.data) {
        return this.createSuccessResponse(
          response.data.data as DrawRoom,
          response.data.message || "Draw room fetched successfully",
        );
      }
      return this.createErrorResponse(
        response.data.message || "Failed to get draw room",
        response.data.errors || [],
      );
    } catch (error) {
      return this.handleError(error, "Failed to get draw room");
    }
  }

  async getDrawRoomPlayers(
    playerId: string,
    roomId: string,
  ): Promise<ServiceResponse<DrawPlayer[]>> {
    try {
      const response = await this.drawApi.apiV1DrawGameRoomRoomIdPlayersGet(roomId, playerId);
      if (response.data.success && response.data.data) {
        return this.createSuccessResponse(
          response.data.data as DrawPlayer[],
          response.data.message || "Draw room players fetched successfully",
        );
      }
      return this.createErrorResponse(
        response.data.message || "Failed to get draw room players",
        response.data.errors || [],
      );
    } catch (error) {
      return this.handleError(error, "Failed to get draw room players");
    }
  }
}

export const drawService = new DrawService();

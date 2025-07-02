import { useAuthStore } from "@/features/auth";
import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import { useCallback, useEffect, useRef, useState } from "react";
import { DrawGameEventHandlers, DrawGameHubContract, EventHandler, SignalRMethod } from "../types";
import { MessagePackHubProtocol } from "@microsoft/signalr-protocol-msgpack";

interface UseDrawGameHubConfig {
  autoConnect?: boolean;
  onStateChange?: (state: HubConnectionState) => void;
  onError?: (error: Error) => void;
}

export const useDrawGameHub = ({ autoConnect = false, onStateChange, onError }: UseDrawGameHubConfig = {}) => {
  const { accessToken } = useAuthStore();

  const [isConnecting, setIsConnecting] = useState(false);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const handlersRef = useRef<Map<string, EventHandler>>(new Map());

  const server = new Proxy({} as DrawGameHubContract["server"], {
    get: (_, methodName: string): SignalRMethod => {
      return (...args: unknown[]): Promise<unknown> => {
        if (connection == null || connection.state !== HubConnectionState.Connected) {
          throw new Error(`Cannot call ${methodName}: Not connected to SignalR hub`);
        }
        return connection.invoke(methodName, ...args);
      };
    },
  });

  const disconnect = useCallback(async () => {
    if (connection && connection.state === HubConnectionState.Connected) {
      console.log("[INFO]: disconnecting from draw game hub");
      await connection.stop();
      setConnection(null);
    }
  }, [connection]);

  const registerEvents = (handlers: DrawGameEventHandlers) => {
    Object.entries(handlers).forEach(([key, handler]) => {
      if (!handler) return;
      const eventName = key.replace(/^on/, "");
      handlersRef.current.set(eventName, handler as EventHandler);
      if (!connection) return;
      connection.on(eventName, handler);
    });
  };

  const unregisterEvents = () => {
    handlersRef.current.forEach((_, eventName) => {
      connection?.off(eventName);
    });
    handlersRef.current.clear();
  };

  const connect = useCallback(async () => {
    if (!accessToken || connection != null || isConnecting) return;
    console.log("[INFO]: connecting to draw game hub");

    setIsConnecting(true);
    onStateChange?.(HubConnectionState.Connecting);

    const newConnection = new HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/hubs/draw-game`, {
        accessTokenFactory: () => accessToken,
      })
      .withHubProtocol(new MessagePackHubProtocol())
      .withAutomaticReconnect()
      .build();

    newConnection.onreconnecting(() => {
      onStateChange?.(HubConnectionState.Reconnecting);
    });

    newConnection.onreconnected(() => {
      onStateChange?.(HubConnectionState.Connected);
    });

    newConnection.onclose((error) => {
      onStateChange?.(HubConnectionState.Disconnected);
      if (error) {
        onError?.(error);
      }
    });

    await newConnection.start();
    setConnection(newConnection);
    onStateChange?.(HubConnectionState.Connected);
    setIsConnecting(false);

    handlersRef.current.forEach((handler, eventName) => {
      newConnection.on(eventName, handler);
    });
  }, [accessToken, connection, isConnecting, onStateChange, onError]);

  useEffect(() => {
    if (autoConnect && accessToken && connection == null) {
      connect();
    }
  }, [accessToken, autoConnect, connect, connection]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return {
    // Connection states
    isConnected: connection?.state === HubConnectionState.Connected,
    isConnecting: connection?.state === HubConnectionState.Connecting,
    connectionState: connection?.state,
    // Connection methods
    connect,
    disconnect,
    // Server methods
    JoinRoom: server.JoinRoom,
    LeaveRoom: server.LeaveRoom,
    SendRoomMessage: server.SendRoomMessage,
    KickPlayer: server.KickPlayer,
    SetRoomState: server.SetRoomState,
    SendDrawAction: server.SendDrawAction,
    SendLiveDrawAction: server.SendLiveDrawAction,
    StartRound: server.StartRound,
    EndRound: server.EndRound,
    // Event handlers
    registerEvents,
    unregisterEvents,
  } as const;
};

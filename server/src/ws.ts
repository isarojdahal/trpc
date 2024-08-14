// pnpm add ws
// pnpm add @types/ws -D

import ws from "ws";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { appRouter } from "./router";
import { createContext } from "./trpc";

const wsInstance = new ws.Server({
  port: 3001,
});

applyWSSHandler({
  wss: wsInstance,
  router: appRouter,
  createContext: createContext,
});

wsInstance.on("connection", (ws) => {
  console.log("connected");

  wsInstance.on("close", () => {
    console.log("disconnected");
  });
});

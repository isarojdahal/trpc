import express from "express";
import cors from "cors";
import { TRPCError, inferAsyncReturnType, initTRPC } from "@trpc/server";
import {
  CreateExpressContextOptions,
  createExpressMiddleware,
} from "@trpc/server/adapters/express";
import { z } from "zod";
import { createContext, protectedProcedure, t } from "./trpc";
import { appRouter } from "./router";
const app = express();
app.use(cors());

app.use(
  "/trpc",
  createExpressMiddleware({ router: appRouter, createContext: createContext })
);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

export type AppRouter = typeof appRouter;

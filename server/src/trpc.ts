import { TRPCError, inferAsyncReturnType, initTRPC } from "@trpc/server";
import { CreateExpressContextOptions } from "@trpc/server/adapters/express";

export function createContext({ req, res }: CreateExpressContextOptions) {
  //check from db and set.
  return {
    req,
    res,
    user: {
      id: 1,
      name: "Saroj",
    },
  };
}
export const t = initTRPC
  .context<inferAsyncReturnType<typeof createContext>>() // for type refering in ctx.
  .create();

//middlewares
export const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      message: "Unauthorized",
      code: "UNAUTHORIZED",
    });
  }

  return next();
});

export const protectedProcedure = t.procedure.use(isAuthenticated);

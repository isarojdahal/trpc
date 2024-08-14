import { z } from "zod";
import { protectedProcedure, t } from "./trpc";
import { EventEmitter } from "events";
import { observable } from "@trpc/server/observable";

const ee = new EventEmitter();

export const appRouter = t.router({
  hello: protectedProcedure
    // .input((name) => {
    //   if (typeof name === "string") return name;
    //   throw new TRPCError({
    //     message: "Name should be a string",
    //     code: "BAD_REQUEST",
    //   });
    // })
    .input(z.object({ name: z.string() }))
    .query(({ input, ctx }) => {
      console.log("ctx", ctx);
      return "Hello " + input.name;
    }),

  add: protectedProcedure
    .input(z.object({ title: z.string(), description: z.string() }))
    .mutation(({ input }) => {
      ee.emit("add", input.title);
      return "added Todo:  " + input.title;
    }),

  onPost: t.procedure.subscription(() => {
    return observable<string>(({ next }) => {
      const onPostAdded = (data: string) => {
        next(data);
      };
      ee.on("add", onPostAdded);
      return () => ee.off("add", onPostAdded);
    });
  }),
});

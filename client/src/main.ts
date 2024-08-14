import {
  createTRPCProxyClient,
  wsLink,
  createWSClient,
  httpBatchLink,
  splitLink,
  loggerLink,
} from "@trpc/client";
import { type AppRouter } from "../../server/src/app";
document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
Main page.

<button id="btn">Click to add Todo</button>


`;

const client = createTRPCProxyClient<AppRouter>({
  links: [
    // the link kept below the batch link won't work
    loggerLink(),
    wsLink({
      client: createWSClient({
        url: "ws://localhost:3001",
      }),
    }),
    splitLink({
      condition: (op) => op.type === "subscription",
      true: wsLink({
        client: createWSClient({
          url: "ws://localhost:3001",
        }),
      }),
      false: httpBatchLink({
        url: "http://localhost:3000/trpc",
      }),
    }),
  ],
});

async function greet() {
  client.hello.query({ name: "Saroj" });
  client.hello.query({ name: "Saroj" });
  client.hello.query({ name: "Saroj" });

  // don't use await for httpBatchLink, it will make individual request only.
}

async function addTodo() {
  const res = await client.add.mutate({
    title: "Finish todo",
    description: "Finish todo by EOD",
  });

  console.log("res", res);
  //
  client.onPost.subscribe(undefined, {
    // data, which is sent from next, is recieved on onData(){}
    onData(value) {
      console.log("From subscription : ", value);
    },
  });
}
greet();

const button = document.getElementById("btn") as HTMLButtonElement;
button.addEventListener("click", () => {
  addTodo();
});

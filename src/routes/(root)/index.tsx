import { clientOnly } from "@solidjs/start";

const WebSocketClient = clientOnly(() => import("../../components/ws-client"));

export default function Sockets() {
  return (
    <div class="grid place-items-center pt-10">
      <h1 class="text-md text-neutral-500 font-bold pb-2">SolidChat</h1>
      <WebSocketClient
        initialSocketUrl={
          import.meta.env.DEV
            ? "ws://localhost:3000/ws"
            : "wss://web-sockets.deno.dev/ws"
        }
      />
    </div>
  );
}

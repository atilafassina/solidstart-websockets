import { createEventSignal } from "@solid-primitives/event-listener";
import { createWS, createWSState } from "@solid-primitives/websocket";
import { createEffect, For } from "solid-js";
import { createStore, produce } from "solid-js/store";

interface Props {
  initialSocketUrl: string;
}

export default function WSClient(props: Props) {
  const socket = createWS(props.initialSocketUrl);
  const socketState = createWSState(socket);
  const socketStatus = () =>
    [WebSocket.CONNECTING, WebSocket.OPEN, WebSocket.CLOSING, WebSocket.CLOSED][
      socketState()
    ];

  const socketMessageEvent = createEventSignal(socket, "message");
  const socketMessage = () => socketMessageEvent()?.data;

  const [messageList, setMessageList] = createStore<string[]>([]);

  createEffect(() => {
    if (socketMessage()) {
      setMessageList(
        produce((messages) => {
          messages.push(socketMessage());

          return messages;
        })
      );
    }
  });
  return (
    <>
      <ul class="h-52 overflow-y-auto font-black">
        <For each={messageList} fallback={<li>No messages yet</li>}>
          {(message) => (
            <li class="odd:text-orange-600 even:text-emerald-600">{message}</li>
          )}
        </For>
      </ul>
      <form
        class="flex flex-row space-x-2"
        onSubmit={(evt) => {
          evt.preventDefault();
          const formData = new FormData(evt.currentTarget);
          socket.send(formData.get("message") as string);
        }}
      >
        <textarea
          name="message"
          id="message"
          class="w-full p-3 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none transition duration-200 ease-in-out"
          rows="2"
          placeholder="Enter your message here..."
        />
        <button
          class="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-200 ease-in-out disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={socketStatus() !== WebSocket.OPEN}
        >
          send
        </button>
      </form>
    </>
  );
}

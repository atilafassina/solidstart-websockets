import { eventHandler } from "vinxi/http";
import {
  uniqueNamesGenerator,
  adjectives,
  animals,
} from "unique-names-generator";

const clients = new Set();
const clientNames = new Map<string, string>();

export default eventHandler({
  handler() {},
  websocket: {
    async open(peer) {
      const name = uniqueNamesGenerator({
        dictionaries: [adjectives, animals],
        separator: " ",
        style: "capital",
        length: 2,
      });
      clientNames.set(peer.id, name);
      clients.add(peer);

      clients.forEach((client) => {
        // @ts-expect-error
        if (client.id === peer.id) {
          // @ts-expect-error
          client.send(`Welcome, ${name}!`);
        } else {
          // @ts-expect-error
          client.send(`${name} has joined the chat.`);
        }
      });
    },
    async message(peer, msg) {
      const message = msg.text();
      console.log("msg", peer.id, peer.url, message);
      clients.forEach((client) => {
        // @ts-expect-error
        client.send(`${clientNames.get(peer.id)} said: ${message}`);
      });
    },
    async close(peer, details) {
      clients.forEach((client) => {
        // @ts-expect-error
        if (client.id === peer.id) {
          // @ts-expect-error
          client.send(`${clientNames.get(peer.id)} (you) left.`);
        } else {
          // @ts-expect-error
          client.send(`${clientNames.get(peer.id)} has left the chat.`);
        }
      });
    },
    async error(peer, error) {
      console.log("error", peer.id, peer.url, error);
      /**
       * log the error somewhere.
       */
    },
  },
});

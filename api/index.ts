import "reflect-metadata";

import Fastify from "fastify";

import { registerGraphQL } from "./graphql/register";
import { registerNextJS } from "./next";

const server = Fastify({
  logger: {
    level: "error",
  },
});

registerGraphQL(server);

registerNextJS(server);

const port = 4050;

server.listen(port, (err) => {
  if (err) throw err;
  console.log(`> Ready on http://localhost:${port}`);
});

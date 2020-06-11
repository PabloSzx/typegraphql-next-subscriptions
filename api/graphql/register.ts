import GQL from "fastify-gql";
import { renderPlaygroundPage } from "graphql-playground-html";

import { schema } from "./schema";

import type { IncomingMessage, ServerResponse, Server } from "http";
import type { FastifyInstance } from "fastify";

export const registerGraphQL = async (
  server: FastifyInstance<Server, IncomingMessage, ServerResponse>
) => {
  server.get("/api/playground", (req, res) => {
    res.type("text/html").send(
      renderPlaygroundPage({
        endpoint: "/api/graphql",
        settings: {
          "general.betaUpdates": true,
          "request.credentials": "include",
          "editor.reuseHeaders": true,
          "tracing.hideTracingResponse": false,
          "tracing.tracingSupported": true,
          "editor.theme": "dark",
          "editor.cursorShape": "block",
          "editor.fontFamily":
            "'Source Code Pro', 'Consolas', 'Inconsolata', 'Droid Sans Mono', 'Monaco', monospace",
          "editor.fontSize": 14,
        },
      })
    );
  });

  server.register(GQL, {
    path: "/api/graphql",
    schema: await schema,
  });
};

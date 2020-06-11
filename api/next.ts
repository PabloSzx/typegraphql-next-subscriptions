import NextJS from "next";
import { resolve } from "path";

import { IS_PRODUCTION } from "../shared/constants";

import type { IncomingMessage, ServerResponse, Server } from "http";
import type { FastifyInstance } from "fastify";

const nextApp = NextJS({
  dev: !IS_PRODUCTION,
  dir: resolve(process.cwd(), "./client"),
});

const nextHandler = nextApp.getRequestHandler();

const prepared = nextApp.prepare();

export const registerNextJS = (
  server: FastifyInstance<Server, IncomingMessage, ServerResponse>
) => {
  server.register((fastify, _opts, next) => {
    prepared
      .then(() => {
        fastify.get("/_next/*", async (req, reply) => {
          await nextHandler(req.req, reply.res);
          reply.sent = true;
        });

        fastify.all("/*", async (req, reply) => {
          nextHandler(req.req, reply.res);
          reply.sent = true;
        });

        fastify.setNotFoundHandler(async (request, reply) => {
          await nextApp.render404(request.req, reply.res);
          reply.sent = true;
        });

        next();
      })
      .catch(next);
  });
};

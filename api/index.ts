import "reflect-metadata";

import cluster from "cluster";
import Fastify from "fastify";
import { cpus } from "os";

import { IS_PRODUCTION } from "../shared/constants";
import { broadcastMessages } from "./graphql/pubsub";

if (cluster.isMaster) {
  if (IS_PRODUCTION) {
    console.log(`Master ${process.pid} is running`);

    const nThreads = cpus().length;
    for (let i = 0; i < nThreads; i++) {
      const fork = cluster.fork();

      broadcastMessages(fork);
    }

    cluster.on("exit", (worker) => {
      console.log(`Worker ${worker.process.pid} died`);
    });
  } else {
    cluster.fork();
  }
} else {
  if (IS_PRODUCTION) console.log(`Worker ${process.pid} is running`);

  (async () => {
    const [{ registerGraphQL }, { registerNextJS }] = await Promise.all([
      import("./graphql/register"),
      import("./next"),
    ]);

    const server = Fastify({
      logger: {
        level: "error",
      },
    });

    await Promise.all([registerGraphQL(server), registerNextJS(server)]);

    const port = 4050;

    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  })();
}

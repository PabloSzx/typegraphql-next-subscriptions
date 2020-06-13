import "reflect-metadata";

import cluster from "cluster";
import Fastify from "fastify";
import { cpus } from "os";

import { IS_PRODUCTION } from "../shared/constants";

if (cluster.isMaster) {
  if (IS_PRODUCTION) console.log(`Master ${process.pid} is running`);

  const workers: Array<cluster.Worker> = [];

  for (let i = 0; i < (IS_PRODUCTION ? cpus().length : 1); i++) {
    const fork = cluster.fork();
    workers.push(fork);

    fork.on("message", (event) => {
      for (const worker of workers) {
        if (worker.id !== event.workerId) {
          worker.send(event);
        }
      }
    });
  }

  if (IS_PRODUCTION) {
    cluster.on("exit", (worker) => {
      console.log(`Worker ${worker.process.pid} died`);
    });
  }
} else {
  if (IS_PRODUCTION) console.log(`Worker ${process.pid} is running`);

  (async () => {
    const [
      { registerGraphQL },
      { registerNextJS },
      { pubSub },
    ] = await Promise.all([
      import("./graphql/register"),
      import("./next"),
      import("./graphql/pubsub"),
    ]);

    const server = Fastify({
      logger: {
        level: "error",
      },
    });

    await Promise.all([registerGraphQL(server), registerNextJS(server)]);

    process.on("message", ({ action, payload }) => {
      pubSub.publish(action, payload);
    });

    const port = 4050;

    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  })();
}

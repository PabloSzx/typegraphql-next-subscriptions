import "reflect-metadata";

import cluster from "cluster";
import Fastify from "fastify";
import { cpus } from "os";

import { IS_PRODUCTION } from "../shared/constants";

if (cluster.isMaster) {
  if (IS_PRODUCTION) {
    console.log(`Master ${process.pid} is running`);

    const nThreads = cpus().length;
    const workers: cluster.Worker[] = [];
    for (let i = 0; i < nThreads; i++) {
      const fork = cluster.fork();
      workers.push(fork);
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
      if (!IS_PRODUCTION) {
        import("axios").then(({ default: { get } }) => {
          get(`http://localhost:${port}/`).catch(console.error);
        });
      }
    });
  })();
}

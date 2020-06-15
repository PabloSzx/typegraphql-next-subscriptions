import cluster from "cluster";
import { PubSub } from "graphql-subscriptions";

export const pubSub = new PubSub();

if (cluster.isWorker) {
  process.on("message", ({ action, payload }) => {
    if (typeof action === "string" && payload != null) {
      pubSub.publish(action, payload);
    }
  });
}

const listeners: Array<cluster.Worker> = [];

export const broadcastMessages = (fork: cluster.Worker) => {
  if (!cluster.isMaster) {
    throw Error("This function should only be called on the master process.");
  }

  listeners.push(fork);

  fork.on("message", (event) => {
    if (typeof event.workerId === "number") {
      for (const worker of listeners) {
        if (worker.id !== event.workerId) {
          worker.send(event);
        }
      }
    }
  });
};

export const pubSubPublish = (action: string, payload: unknown) => {
  pubSub.publish(action, payload).catch(console.error);

  process.send!({
    action,
    payload,
    workerId: cluster.worker.id,
  });
};

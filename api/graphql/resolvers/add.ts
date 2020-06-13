import * as cluster from "cluster";
import { Arg, Int, Query, Resolver, Root, Subscription } from "type-graphql";

import { pubSub } from "../pubsub";

export const NOTIFICATION = "notification";

let data = 1;

pubSub.subscribe(NOTIFICATION, (payload) => {
  process.send?.({
    action: NOTIFICATION,
    payload,
    workerId: cluster.worker.id,
  });
});

@Resolver()
export class Add {
  @Query(() => Number)
  async add(@Arg("x") x: number, @Arg("y") y: number) {
    const n = x + y;

    data += n;
    pubSub.publish(NOTIFICATION, data).catch(console.error);

    return data;
  }

  @Subscription(() => Int, {
    topics: NOTIFICATION,
  })
  newNotification(@Root() payload: number): number {
    return payload;
  }
}

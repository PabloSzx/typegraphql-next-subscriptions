import { Arg, Int, Query, Resolver, Root, Subscription } from "type-graphql";
import cluster from "cluster";
import { data } from "../../data";
import { pubSub } from "../pubsub";

export const NOTIFICATION = "notification";

pubSub.subscribe(NOTIFICATION, (payload) => {
  data.n = payload;
});

@Resolver()
export class Add {
  @Query(() => Number)
  async add(@Arg("x") x: number, @Arg("y") y: number) {
    const n = x + y;

    data.n += n;

    pubSub.publish(NOTIFICATION, data.n).catch(console.error);
    process.send?.({
      action: NOTIFICATION,
      payload: data.n,
      workerId: cluster.worker.id,
    });

    return data.n;
  }

  @Subscription(() => Int, {
    topics: NOTIFICATION,
  })
  newNotification(@Root() payload: number): number {
    return payload;
  }
}

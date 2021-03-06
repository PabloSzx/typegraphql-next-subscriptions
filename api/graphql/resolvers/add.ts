import { Arg, Int, Query, Resolver, Root, Subscription } from "type-graphql";
import { data } from "../../data";
import { pubSub } from "../pubsub";

export const NOTIFICATION = "notification";

pubSub.subscribe(NOTIFICATION, (payload: number) => {
  data.n = payload;
});

@Resolver()
export class Add {
  @Query(() => Number)
  async add(@Arg("x") x: number, @Arg("y") y: number) {
    const n = x + y;

    const result = data.n + n;

    pubSub.publish(NOTIFICATION, result);

    return result;
  }

  @Subscription(() => Int, {
    topics: NOTIFICATION,
  })
  newNotification(@Root() payload: number): number {
    return payload;
  }
}

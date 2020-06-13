import {
  Arg,
  PubSub,
  PubSubEngine,
  Query,
  Resolver,
  Root,
  Subscription,
} from "type-graphql";

const NOTIFICATION = "notification";

let data = 1;

@Resolver()
export class Add {
  @Query(() => Number)
  async add(
    @Arg("x") x: number,
    @Arg("y") y: number,
    @PubSub() pubSub: PubSubEngine
  ) {
    const n = x + y;

    data += n;
    await pubSub.publish(NOTIFICATION, data.toString(10));

    return data;
  }

  @Subscription({
    topics: NOTIFICATION,
  })
  newNotification(@Root() payload: string): string {
    return payload;
  }
}

import { Resolver, Query, Arg } from "type-graphql";

@Resolver()
export class Add {
  @Query(() => Number)
  async add(@Arg("x") x: number, @Arg("y") y: number) {
    return x + y + 2;
  }
}

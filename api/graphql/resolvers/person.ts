import { ObjectType, Query, Resolver, Field } from "type-graphql";
import { CacheControl } from "../cacheDecorator";

@ObjectType()
export class Person {
  @Field()
  name: string;
}

@Resolver(() => Person)
export class PersonResolver {
  @CacheControl()
  @Query(() => [Person])
  persons(): Person[] {
    return [
      {
        name: "a",
      },
      {
        name: "b",
      },
    ];
  }
}

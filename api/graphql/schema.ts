import { buildSchema } from "type-graphql";

import { pubSub } from "./pubsub";
import * as resolvers from "./resolvers";

export const schema = buildSchema({
  resolvers: Object.values(resolvers) as any,
  emitSchemaFile: true,
  pubSub,
});

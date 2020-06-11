import { buildSchema } from "type-graphql";

import * as resolvers from "./resolvers";

export const schema = buildSchema({
  resolvers: Object.values(resolvers) as any,
});

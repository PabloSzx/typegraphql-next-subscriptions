import Redis from "ioredis";
import { MD5 } from "object-hash";
import { createMethodDecorator } from "type-graphql";

const redis = new Redis();

const emptyObject = {};

export function CacheControl<Ctx = any, Root = any>({
  maxAge = 30,
  extraCacheKey,
}: {
  /**
   * maxAge in seconds.
   */
  maxAge?: number;
  /**
   * Cache key to be added.
   *
   * By default it only uses the Schema path + arguments.
   */
  extraCacheKey?: (args: { context: Ctx; root: Root }) => unknown;
} = emptyObject) {
  return createMethodDecorator<Ctx>(
    async ({ info: { path }, context, root, args }, next) => {
      const cacheKey =
        "gql-cache:" +
        MD5({
          a: args,
          p: path,
          c: extraCacheKey?.({
            context,
            root,
          }),
        });

      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        try {
          return JSON.parse(cachedData);
        } catch (err) {
          redis.unlink(cacheKey).catch(console.error);
        }
      }

      const result = await next();

      redis
        .set(cacheKey, JSON.stringify(result), "EX", maxAge)
        .catch(console.error);

      return result;
    }
  );
}

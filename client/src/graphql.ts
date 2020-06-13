import { SubscriptionClient } from "subscriptions-transport-ws";
import { Client, defaultExchanges, subscriptionExchange } from "urql";

import { IS_BROWSER } from "../../shared/constants";

export const client = new Client({
  url: "/api/graphql",
  exchanges: [
    ...defaultExchanges,
    ...(IS_BROWSER
      ? [
          subscriptionExchange({
            forwardSubscription(operation) {
              return new SubscriptionClient("ws://localhost:4050/api/graphql", {
                reconnect: true,
              }).request(operation);
            },
          }),
        ]
      : []),
  ],
});

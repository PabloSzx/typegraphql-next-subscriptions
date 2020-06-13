import { AppProps } from "next/app";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { Client, defaultExchanges, Provider, subscriptionExchange } from "urql";

import { IS_BROWSER } from "../../shared/constants";

const client = new Client({
  url: "/graphql",
  exchanges: [
    ...defaultExchanges,
    ...(IS_BROWSER
      ? [
          subscriptionExchange({
            forwardSubscription(operation) {
              return new SubscriptionClient("ws://localhost:4050/api/graphql", {
                reconnect: true,
                lazy: false,
              }).request(operation);
            },
          }),
        ]
      : []),
  ],
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Provider value={client}>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

export default MyApp;

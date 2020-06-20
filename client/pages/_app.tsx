import { Provider } from "urql";

import { cache } from "@emotion/css";
import { CacheProvider, css, Global } from "@emotion/react";
import { client } from "../src/graphql/client";

import type { AppProps } from "next/app";

export const globalStyles = (
  <Global
    styles={css`
      @import url("https://fonts.googleapis.com/css2?family=Lato&display=swap");
      html,
      body {
        font-family: "Lato", sans-serif;
      }
      button {
        font-family: "Lato", sans-serif;
        cursor: pointer;
        :disabled {
          cursor: not-allowed;
        }
      }
    `}
  />
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CacheProvider value={cache}>
      {globalStyles}
      <Provider value={client}>
        <Component {...pageProps} />
      </Provider>
    </CacheProvider>
  );
}

export default MyApp;

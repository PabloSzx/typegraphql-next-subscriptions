import { useQuery, useSubscription } from "urql";

import { IS_BROWSER } from "../../shared/constants";

export default () => {
  const [{ data }] = useSubscription({
    query: `subscription {
      newNotification
    }`,
    pause: !IS_BROWSER,
  });
  const [dataAdd, add] = useQuery({
    query: `
    query {
      add(x: 1, y: 2)
    }
  `,
    pollInterval: 1000,
    requestPolicy: "cache-and-network",
  });

  return (
    <div>
      <p>{JSON.stringify(data)}</p>
      <p>{JSON.stringify(dataAdd.data)}</p>
      <button
        onClick={() => {
          add({
            requestPolicy: "network-only",
          });
        }}
      >
        add
      </button>
    </div>
  );
};

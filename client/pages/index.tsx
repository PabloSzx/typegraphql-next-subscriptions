import { IS_BROWSER } from "../../shared/constants";
import { useNewNSubscription, useAddQuery } from "../src/graphql";

export default () => {
  const [{ data }] = useNewNSubscription({
    pause: !IS_BROWSER,
  });
  const [dataAdd, add] = useAddQuery({
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

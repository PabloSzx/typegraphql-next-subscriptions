import { useSubscription } from "urql";

import { IS_BROWSER } from "../../shared/constants";

export default () => {
  const [{ data }] = useSubscription({
    query: `subscription {
      newNotification
    }`,
    pause: !IS_BROWSER,
  });
  return <div>hello world {JSON.stringify(data)}</div>;
};

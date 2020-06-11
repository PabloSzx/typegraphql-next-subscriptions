import { IS_PRODUCTION } from "../../shared/constants";

export default () => {
  return <div>hello world {IS_PRODUCTION ? "yes" : "no"}</div>;
};

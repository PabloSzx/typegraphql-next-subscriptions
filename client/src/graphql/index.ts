import gql from "graphql-tag";
import * as Urql from "urql";
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Person = {
  __typename?: "Person";
  name: Scalars["String"];
};

export type Query = {
  __typename?: "Query";
  add: Scalars["Float"];
  persons: Array<Person>;
};

export type QueryAddArgs = {
  x: Scalars["Float"];
  y: Scalars["Float"];
};

export type Subscription = {
  __typename?: "Subscription";
  newNotification: Scalars["Int"];
};

export type NewNSubscriptionVariables = Exact<{ [key: string]: never }>;

export type NewNSubscription = { __typename?: "Subscription" } & Pick<
  Subscription,
  "newNotification"
>;

export type AddQueryVariables = Exact<{ [key: string]: never }>;

export type AddQuery = { __typename?: "Query" } & Pick<Query, "add">;

export const NewNDocument = gql`
  subscription newN {
    newNotification
  }
`;

export function useNewNSubscription<TData = NewNSubscription>(
  options: Omit<
    Urql.UseSubscriptionArgs<NewNSubscriptionVariables>,
    "query"
  > = {},
  handler?: Urql.SubscriptionHandler<NewNSubscription, TData>
) {
  return Urql.useSubscription<
    NewNSubscription,
    TData,
    NewNSubscriptionVariables
  >({ query: NewNDocument, ...options }, handler);
}
export const AddDocument = gql`
  query add {
    add(x: 1, y: 2)
  }
`;

export function useAddQuery(
  options: Omit<Urql.UseQueryArgs<AddQueryVariables>, "query"> = {}
) {
  return Urql.useQuery<AddQuery>({ query: AddDocument, ...options });
}

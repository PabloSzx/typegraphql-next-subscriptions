export const IS_PRODUCTION = process.env.NODE_ENV === "production";
//@ts-expect-error
export const IS_BROWSER = typeof window !== "undefined";

export const PROTOCOL =
  process.env.NODE_ENV === "production" ? "https" : "http";
export const DOMAIN =
  process.env.NODE_ENV === "production"
    ? "htbgzenw76.execute-api.us-east-1.amazonaws.com"
    : "localhost:3000";

import { Hono } from "hono";
import { userRouter } from "./routes/userRoute";

import { cors } from "hono/cors";
import { blogRouter } from "./routes/blogRoute";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();
app.use("/*", cors());
app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);

export default app;

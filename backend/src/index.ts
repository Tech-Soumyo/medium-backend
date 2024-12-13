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
// app.use("/*", cors());

http: app.use(
  "/*",
  cors({
    origin: [
      "https://medium2-4sc7v32gy-soumyodeeps-projects-9c45e977.vercel.app",
      "https://medium2-ten.vercel.app",
    ],
    // allowHeaders: ["X-Custom-Header", "Upgrade-Insecure-Requests"],
    allowMethods: ["POST", "GET", "OPTIONS", "PUT", "DELETE"],
    // exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    // maxAge: 600,
    // credentials: true,
  })
);
app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);

export default app;

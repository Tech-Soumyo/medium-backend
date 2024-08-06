import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { jwt, sign, verify } from "hono/jwt";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

app.post("/api/v1/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
      },
    });
    const token = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ jwt: token });
  } catch (e) {
    console.error("Signup Error:", e); // Log the actual error
    c.status(403);
    if (e instanceof Error) {
      return c.json({ error: "error while signing up", details: e.message });
    } else {
      return c.json({
        error: "error while signing up",
        details: "Unknown error occurred",
      });
    }
  }
});

app.post("/api/v1/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
      password: body.password,
    },
  });

  if (!user) {
    c.status(403);
    return c.json({ error: "user not found" });
  }

  const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
  return c.json({ jwt });
});

app.use("/api/v1/blog/*", async (c, next) => {
  // Get the authorization header
  const header = c.req.header("authorization") || "";

  // Bearer token => ["Bearer", "token"]
  const token = header.split(" ")[1];

  if (!token) {
    // If no token is present, return a 403 status code
    c.status(403);
    return c.json({ error: "Unauthorized" });
  }

  try {
    // Verify the token
    const response = await verify(token, c.env.JWT_SECRET);

    if (response.id) {
      // If the token is valid, proceed to the next middleware
      return next();
    } else {
      // If the token is invalid, return a 403 status code
      c.status(403);
      return c.json({ error: "Unauthorized" });
    }
  } catch (error) {
    // Handle errors in the verification process
    c.status(500);
    return c.json({ error: "Internal Server Error" });
  }
});

app.put("/api/v1/blog", (c) => {
  return c.text("Blog Page!");
});

app.get("/api/v1/blog/:id", (c) => {
  return c.text("Blog Id!");
});

app.get("/api/v1/blog/bulk", (c) => {
  return c.text("Blog Id!");
});

app.get("/", (c) => {
  return c.text("Blog Id!");
});
export default app;

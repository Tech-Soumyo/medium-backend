import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { jwt, sign, verify } from "hono/jwt";
import bcrypt from "bcrypt";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

app.post("/api/v1/signup", async (c) => {
  // Initialize Prisma client with the database URL and acceleration extension
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    // Parse the request body to get email and password
    const body = await c.req.json();

    // Validate the input: Check if email and password are provided
    if (!body.email || !body.password) {
      c.status(400); // Bad Request
      return c.json({ error: "Email and password are required" });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // Create the user in the database
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
      },
    });

    // Generate a JWT token with the user's ID
    const token = await sign({ id: user.id }, c.env.JWT_SECRET);

    // Return the JWT token in the response
    return c.json({ jwt: token });
  } catch (e) {
    // Log the actual error for debugging
    console.error("Signup Error:", e);

    // Return a 403 status code and error message
    c.status(403); // Forbidden
    return c.json({
      error: "Error while signing up",
      details: e instanceof Error ? e.message : "Unknown error occurred",
    });
  } finally {
    // Ensure the Prisma client is disconnected after the request is processed
    await prisma.$disconnect();
  }
});

app.post("/api/v1/signin", async (c) => {
  // Initialize Prisma client with the database URL and acceleration extension
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    // Parse the request body to get email and password
    const body = await c.req.json();

    // Validate the input: Check if email and password are provided
    if (!body.email || !body.password) {
      c.status(400); // Bad Request
      return c.json({ error: "Email and password are required" });
    }

    // Find the user in the database by email
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
        password: body.password,
      },
    });

    // If the user is not found, return a 403 status code
    if (!user) {
      c.status(403); // Forbidden
      return c.json({ error: "User not found" });
    }

    // Verify the password using bcrypt
    const isPasswordValid = await bcrypt.compare(body.password, user.password);
    if (!isPasswordValid) {
      // If the password is invalid, return a 403 status code
      c.status(403); // Forbidden
      return c.json({ error: "Invalid credentials" });
    }

    // Generate a JWT token with the user's ID
    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);

    // Return the JWT token in the response
    return c.json({ jwt });
  } catch (error) {
    // Handle any errors during the process
    c.status(500); // Internal Server Error
    return c.json({ error: "Internal Server Error" });
  } finally {
    // Ensure the Prisma client is disconnected after the request is processed
    await prisma.$disconnect();
  }
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

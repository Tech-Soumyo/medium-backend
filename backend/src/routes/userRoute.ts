import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { signinInput, signupInput } from "@devs-project/medium2-common";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

userRouter.post("/signup", async (c) => {
  // console.log("Request Headers:", c.req.header);

  const body = await c.req.json();
  console.log("Request Body:", body);
  const { success } = signupInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({ message: "Inputs not correct" });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        name: body.name,
      },
    });
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    const jwt = await sign(userResponse, c.env.JWT_SECRET);
    return c.json({
      jwt: jwt,
      user: userResponse,
    });
  } catch (e) {
    console.log(e);
    c.status(411);
    return c.text("Invalid");
  }
});

userRouter.post("/signin", async (c) => {
  // console.log("Request Headers:", c.req.header);

  const body = await c.req.json();
  console.log("Request Body:", body);
  const { success } = signinInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({ message: "Inputs not correct" });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const user = await prisma.user.findFirst({
      where: { email: body.username, password: body.password },
    });

    if (!user) {
      c.status(403);
      return c.json({ message: "Incorrect credentials" });
    }

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    const jwt = await sign(userResponse, c.env.JWT_SECRET);
    console.log(user);
    return c.json({ jwt: jwt, user: userResponse });
  } catch (e) {
    console.log(e);
    c.status(411);
    return c.text("Invalid");
  }
});

// import { createBlogInput, updateBlogInput } from "@100xdevs/medium-common";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

blogRouter.use("/*", async (c, next) => {
  const authorizationHeader = c.req.header("Authorization");
  if (!authorizationHeader) {
    c.status(401);
    return c.json({ error: "Unauthorized: No Authorization header" });
  }

  const token = authorizationHeader.split(" ")[1];
  try {
    const payload = await verify(token, c.env.JWT_SECRET);
    if (!payload || typeof payload.id !== "string") {
      c.status(401);
      return c.json({ error: "Unauthorized: Invalid token or payload" });
    }

    c.set("userId", payload.id);
    await next();
  } catch (error) {
    c.status(401);
    return c.json({ error: "Unauthorized: Token verification failed" });
  }
});

blogRouter.post("/", async (c) => {
  const body: any = c.req.json();
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  // const authorId = c.get("userId");
  const blog = await prisma.blog.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: 1,
    },
  });
  return c.json({
    id: blog.id,
  });
});

blogRouter.put("/", async (c) => {
  const body: any = c.req.json();
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  // const authorId = c.get("userId");
  const blog = await prisma.blog.update({
    where: {
      id: body.id,
    },
    data: {
      title: body.title,
      content: body.content,
      authorId: 1,
    },
  });
  return c.json({
    id: blog.id,
  });
});

blogRouter.get("/", async (c) => {
  const body: any = c.req.json();
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  // const authorId = c.get("userId");
  try {
    const blog = await prisma.blog.findFirst({
      where: {
        id: body.id,
      },
    });
    return c.json({
      blog,
    });
  } catch (error) {
    c.status(411);
    return c.json({ error: "Error while fetching Blog Posts" });
  }
});

blogRouter.get("/bulk", (c) => {
  return c.text("Blog Id!");
});

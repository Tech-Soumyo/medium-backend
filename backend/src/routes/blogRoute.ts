import { creatPostInput, updatePostInput } from "@devs-project/medium2-common";
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
  const authHeader = c.req.header("authorization") || "";

  const user = (await verify(authHeader, c.env.JWT_SECRET)) as {
    id: string;
  } | null;

  if (user) {
    c.set("userId", user.id);
    await next();
  } else {
    c.status(403);
    return c.json({
      message: "You are not logged in",
    });
  }
});

blogRouter.post("/", async (c) => {
  const body = await c.req.json();
  const { success } = creatPostInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Inputs not correct",
    });
  }

  const authorId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const blog = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: authorId,
      published: true,
    },
  });

  return c.json({
    id: blog.id,
    title: blog.title,
    user_id: authorId,
  });
});

blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const blogs = await prisma.post.findMany({
    select: {
      content: true,
      title: true,
      id: true,
      // published: true,
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  return c.json({
    blogs,
  });
});

blogRouter.get("/:id", async (c) => {
  const blogid = c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blog = await prisma.post.findFirst({
      where: {
        id: blogid,
      },
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        authorId: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });
    return c.json({
      blog,
    });
  } catch (e) {
    c.status(411); // 4
    return c.json({
      message: "Error while fetching blog post",
    });
  }
});
blogRouter.delete("/delete/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const token = c.req.header("authorization");
  if (!token) {
    return c.json({ msg: "Authentication token is missing" });
  }

  let userId;
  try {
    const decoded = await verify(token, c.env.JWT_SECRET);
    userId = decoded.id;
  } catch (e) {
    return c.json({ msg: "Invalid or expired token" });
  }

  const blogId = c.req.param("id");
  try {
    // Retrieve the post to check if the user is authorized to delete it
    const post = await prisma.post.findUnique({
      where: {
        id: blogId,
      },
    });

    if (!post) {
      return c.json({ msg: "Post not found" });
    }

    if (post.authorId !== userId) {
      return c.json({ msg: "User not authorized to delete this post" });
    }
    console.log(post.authorId);
    console.log(userId);

    await prisma.post.delete({
      where: {
        id: blogId,
      },
    });

    return c.json({ message: "Successfully deleted blog" });
  } catch (e) {
    console.log(e);
    return c.json({ msg: "Failed to delete post" });
  }
});
blogRouter.put("/update/:id", async (c) => {
  // Initialize Prisma client with accelerated database extension
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  // Extract and validate the Authorization header for JWT token
  const token = c.req.header("authorization");
  if (!token) {
    return c.json({ msg: "Authentication token is missing" }, 401);
  }

  let userId;
  try {
    // Verify the token and extract the user ID from the payload
    const decoded = await verify(token, c.env.JWT_SECRET);
    userId = decoded.id;
    console.log("jwt toket is verified", decoded);
    console.log("token", token);
    console.log("userId", decoded.id);
  } catch (e) {
    return c.json({ msg: "Invalid or expired token" }, 401);
  }

  // Extract the blog ID from the URL parameter
  const id = c.req.param("id");

  try {
    // Fetch the post to ensure it exists and is authored by the current user
    const blog = await prisma.post.findUnique({
      where: { id: id },
    });

    if (!blog) {
      console.log("Post not found");
      return c.json({ msg: "Post not found" }, 404);
    }

    if (blog.authorId !== userId) {
      console.log("User not authorized to update this post");
      return c.json({ msg: "User not authorized to update this post" }, 403);
    }

    // Parse and validate the request body
    const body = await c.req.json();
    console.log("before validation", body.title);
    const validationResult = updatePostInput.safeParse(body);
    if (!validationResult.success) {
      console.log("Invalid input data");
      return c.json({ msg: "Invalid input data" }, 400);
    }

    const { title, content } = validationResult.data;
    console.log("after validation", body.title);

    // Update the post with the provided title and/or content
    await prisma.post.update({
      where: { id: id },
      data: {
        title: body.title,
        content: body.content,
      },
    });

    // Send a success response
    return c.json({ message: "Successfully updated post" }, 200);
  } catch (e) {
    console.error(e);
    return c.json({ msg: "Failed to update post" }, 500);
  }
});

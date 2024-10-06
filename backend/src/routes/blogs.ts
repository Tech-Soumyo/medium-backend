// import { createBlogInput, updateBlogInput } from "@100xdevs/medium-common";
import { creatBlogInput, updateBlogInput } from "@devs-project/medium-common";
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
//
blogRouter.use("/*", async (c, next) => {
  const authHeader = c.req.header("authorization") || "";

  try {
    // Verify user through the JWT token
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
  } catch (e) {
    c.status(403);
    return c.json({
      message: "You are not logged in",
    });
  }
});
//
blogRouter.post("/", async (c) => {
  const body = await c.req.json();
  const { success } = creatBlogInput.safeParse(body);
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

  const blog = await prisma.blog.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: Number(authorId),
    },
  });

  return c.json({
    id: blog.id,
  });
});

blogRouter.put("/", async (c) => {
  const body = await c.req.json();
  const { success } = updateBlogInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Inputs not correct",
    });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const blog = await prisma.blog.update({
    where: {
      id: body.id,
    },
    data: {
      title: body.title,
      content: body.content,
    },
  });

  return c.json({
    id: blog.id,
  });
});

// Todo: add pagination
blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const blogs = await prisma.blog.findMany({
    select: {
      content: true,
      title: true,
      id: true,
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
  const id: any = c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blog = await prisma.blog.findFirst({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        title: true,
        content: true,
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
  } catch (error) {
    c.status(411);
    return c.json({ error: "Error while fetching Blog Posts" });
  }
});

// blogRouter.delete("/delete/:id", async (c) => {
//   const prisma = new PrismaClient({
//     datasourceUrl: c.env.DATABASE_URL,
//   }).$extends(withAccelerate());

//   const token = c.req.header("authorization");
//   if (!token) {
//     return c.json({ msg: "Authentication token is missing" });
//   }

//   let userId;
//   try {
//     const decoded = await verify(token, c.env.JWT_SECRET);
//     userId = decoded.id;
//   } catch (e) {
//     return c.json({ msg: "Invalid or expired token" });
//   }

//   const postId: any = await c.req.param("id");
//   try {
//     // Retrieve the post to check if the user is authorized to delete it
//     const post = await prisma.blog.findUnique({
//       where: {
//         id: postId,
//       },
//     });

//     if (!post) {
//       return c.json({ msg: "Post not found" });
//     }

//     if (post.authorId !== userId) {
//       return c.json({ msg: "User not authorized to delete this post" });
//     }
//     console.log(post.authorId);
//     console.log(userId);

//     await prisma.blog.delete({
//       where: {
//         id: postId,
//       },
//     });

//     return c.json({ message: "Successfully deleted blog" });
//   } catch (e) {
//     console.log(e);
//     return c.json({ msg: "Failed to delete post" });
//   }
// });

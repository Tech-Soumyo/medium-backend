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

blogRouter.use("/*", async (c, next) => {
  const authHeader = c.req.header("authorization") || "";

  try {
    // Verify the JWT token
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
    });
    return c.json({
      blog,
    });
  } catch (error) {
    c.status(411);
    return c.json({ error: "Error while fetching Blog Posts" });
  }
});

// blogRouter.get("/:id", async (c) => {
//   const id = c.req.param("id");
//   const prisma = new PrismaClient({
//     datasourceUrl: c.env.DATABASE_URL,
//   }).$extends(withAccelerate());

//   try {
//     const blog = await prisma.blog.findFirst({
//       where: {
//         id: Number(id),
//       },
//       select: {
//         id: true,
//         title: true,
//         content: true,
//         author: {
//           select: {
//             name: true,
//           },
//         },
//       },
//     });

//     return c.json({
//       blog,
//     });
//   } catch (e) {
//     c.status(411); // 4
//     return c.json({
//       message: "Error while fetching blog post",
//     });
//   }
// });

// // import { createBlogInput, updateBlogInput } from "@100xdevs/medium-common";
// import { PrismaClient } from "@prisma/client/edge";
// import { withAccelerate } from "@prisma/extension-accelerate";
// import { Hono } from "hono";
// import { verify } from "hono/jwt";

// export const blogRouter = new Hono<{
//   Bindings: {
//     DATABASE_URL: string;
//     JWT_SECRET: string;
//   };
//   Variables: {
//     userId: string;
//   };
// }>();

// blogRouter.use("/*", async (c, next) => {
//   const authorizationHeader = c.req.header("Authorization");
//   if (!authorizationHeader) {
//     c.status(401);
//     return c.json({ error: "Unauthorized: No Authorization header" });
//   }

//   const token = authorizationHeader.split(" ")[1];
//   try {
//     const payload = await verify(token, c.env.JWT_SECRET);
//     if (!payload || typeof payload.id !== "string") {
//       c.status(401);
//       return c.json({ error: "Unauthorized: Invalid token or payload" });
//     }

//     c.set("userId", payload.id);
//     await next();
//   } catch (error) {
//     c.status(401);
//     return c.json({ error: "Unauthorized: Token verification failed" });
//   }
// });

// blogRouter.post("/", async (c) => {
//   const body: any = c.req.json();
//   const prisma = new PrismaClient({
//     datasourceUrl: c.env.DATABASE_URL,
//   }).$extends(withAccelerate());

//   const authorId = c.get("userId");
//   const blog = await prisma.blog.create({
//     data: {
//       title: body.title,
//       content: body.content,
//       authorId: Number(authorId),
//     },
//   });
//   return c.json({
//     id: blog.id,
//   });
// });

// blogRouter.put("/", async (c) => {
//   const body: any = c.req.json();
//   const prisma = new PrismaClient({
//     datasourceUrl: c.env.DATABASE_URL,
//   }).$extends(withAccelerate());

//   const blog = await prisma.blog.update({
//     where: {
//       id: body.id,
//     },
//     data: {
//       title: body.title,
//       content: body.content,
//     },
//   });
//   return c.json({
//     id: blog.id,
//   });
// });

// // TODO Pagination
// blogRouter.get("/bulk", async (c) => {
//   const prisma = new PrismaClient({
//     datasourceUrl: c.env.DATABASE_URL,
//   }).$extends(withAccelerate());
//   const body: any = c.req.json();

//   const blogs = await prisma.blog.findMany();

//   return c.json({
//     blogs,
//   });
// });

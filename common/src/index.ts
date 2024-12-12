import z from "zod";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const signupInput = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .refine((val) => emailRegex.test(val), {
      message: "Email must match the pattern: example@domain.com",
    }),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  name: z.string().optional(),
});
export const signinInput = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const creatPostInput = z.object({
  title: z.string(),
  content: z.string(),
});
export const updatePostInput = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  id: z.string(),
});

export type SignupInput = z.infer<typeof signupInput>;
export type SigninInput = z.infer<typeof signinInput>;
export type CreatePostInput = z.infer<typeof creatPostInput>;
export type UpdatePostInput = z.infer<typeof updatePostInput>;

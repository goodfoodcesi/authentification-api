import { Elysia, t } from "elysia";

export const signInBodySchema = t.Object({
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 1 }),
});

export type SignInBody = typeof signInBodySchema.static;

export const signInResponseSchema = t.Object({
  user: t.Object({
    id: t.String(),
    name: t.String(),
    email: t.String(),
    userType: t.String(),
    emailVerified: t.Boolean(),
  }),
  session: t.Object({
    token: t.String(),
  }),
});

export type SignInResponse = typeof signInResponseSchema.static;

export const { models: signInSchemas } = new Elysia().model({
  signIn: signInBodySchema,
  response: signInResponseSchema,
});

export const signInResponse = t.Object({
  data: signInResponseSchema,
  timestamp: t.Date(),
});

export type SignInResponseSchema = typeof signInResponse.static;


import { Elysia, t } from "elysia";

export const signUpBodySchema = t.Object({
  name: t.String({ minLength: 1 }),
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 8 }),
});

export type SignUpBody = typeof signUpBodySchema.static;

export const driverSignUpBodySchema = t.Object({
  name: t.String({ minLength: 1 }),
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 8 }),
});

export type DriverSignUpBody = typeof driverSignUpBodySchema.static;

export const signUpResponseSchema = t.Object({
  id: t.String(),
  name: t.String(),
  email: t.String(),
  userType: t.String(),
  emailVerified: t.Boolean(),
  createdAt: t.String(),
});

export type SignUpResponse = typeof signUpResponseSchema.static;

export const { models: signUpSchemas } = new Elysia().model({
  signUp: signUpBodySchema,
  driverSignUp: driverSignUpBodySchema,
  response: signUpResponseSchema,
});

export const signUpResponse = t.Object({
  data: signUpResponseSchema,
  timestamp: t.Date(),
});

export type SignUpResponseSchema = typeof signUpResponse.static;


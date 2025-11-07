import { UserType } from "@/types/user_type.type";
import { apiErrorResponse } from "@/utils/api-response";
import { createErrorHandler } from "@/utils/error-handler";
import { Elysia } from "elysia";
import { signInBodySchema, signInResponse } from "./models";
import { SignInService } from "./service";

export const signInController = new Elysia({ prefix: "/auth/sign-in", detail: {
  tags: ["Authentication"],
} })
  .onError(createErrorHandler())
  .post("/driver", async ({ body }) => {
    return await SignInService.signIn(body, UserType.DRIVER);
  }, {
    body: signInBodySchema,
    response: {
      200: signInResponse,
      400: apiErrorResponse,
      401: apiErrorResponse,
      403: apiErrorResponse,
      500: apiErrorResponse,
    },
  })
  .post("/shop", async ({ body }) => {
    return await SignInService.signIn(body, UserType.SHOP);
  }, {
    body: signInBodySchema,
    response: {
      200: signInResponse,
      400: apiErrorResponse,
      401: apiErrorResponse,
      403: apiErrorResponse,
      500: apiErrorResponse,
    },
  });


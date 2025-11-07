import { UserType } from "@/types/user_type.type";
import { apiErrorResponse } from "@/utils/api-response";
import { createErrorHandler } from "@/utils/error-handler";
import { Elysia } from "elysia";
import { driverSignUpBodySchema, signUpBodySchema, signUpResponse } from "./models";
import { SignUpService } from "./service";

export const signUpController = new Elysia({ prefix: "/auth/sign-up", detail: {
  tags: ["Authentication"],
} })
  .onError(createErrorHandler())
  .post("/driver", async ({ body }) => {
    return await SignUpService.signUpDriver(body);
  }, {
    body: driverSignUpBodySchema,
    response: {
      201: signUpResponse,
      400: apiErrorResponse,
      409: apiErrorResponse,
      500: apiErrorResponse,
    },
  })
  .post("/shop", async ({ body }) => {
    return await SignUpService.signUp(body, UserType.SHOP);
  }, {
    body: signUpBodySchema,
    response: {
      201: signUpResponse,
      400: apiErrorResponse,
      409: apiErrorResponse,
      500: apiErrorResponse,
    },
  });


import { auth } from "@/lib/auth";
import { createErrorResponse, createSuccessResponse } from "@/utils/api-response";
import { status } from "elysia";
import type { SignInBody } from "./models";
import { SignInRepository } from "./repository";

export abstract class SignInService {
  static async signIn(data: SignInBody, allowedUserType: string) {
    try {
      const user = await SignInRepository.findByEmail(data.email);
      if (!user) {
        return status(401, createErrorResponse("Invalid email or password"));
      }

      if (user.userType !== allowedUserType) {
        return status(403, createErrorResponse(`Access denied. This endpoint is only for ${allowedUserType} users.`));
      }

      const signInResult = await auth.api.signInEmail({
        body: {
          email: data.email,
          password: data.password,
        },
      });

      if (!signInResult?.user || !signInResult?.token) {
        return status(401, createErrorResponse("Invalid email or password"));
      }

      return status(200, createSuccessResponse({
        user: {
          id: signInResult.user.id,
          name: signInResult.user.name,
          email: signInResult.user.email,
          userType: (signInResult.user as { userType?: string }).userType || allowedUserType,
          emailVerified: signInResult.user.emailVerified,
        },
        session: {
          token: signInResult.token,
        },
      }));
    } catch (error: unknown) {
      console.error("Sign in error:", error);
      return status(401, createErrorResponse("Email ou mot de passe incorrect"));
    }
  }
}


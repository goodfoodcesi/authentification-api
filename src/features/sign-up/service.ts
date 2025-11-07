import { auth } from "@/lib/auth";
import { createErrorResponse, createSuccessResponse } from "@/utils/api-response";
import { status } from "elysia";
import type { DriverSignUpBody, SignUpBody } from "./models";
import { SignUpRepository } from "./repository";

export abstract class SignUpService {
  static async signUp(data: SignUpBody, userType: string) {
    try {
      const existingUser = await SignUpRepository.findByEmail(data.email);
      if (existingUser) {
        return status(409, createErrorResponse("User with this email already exists"));
      }

      const signUpResult = await auth.api.signUpEmail({
        body: {
          name: data.name,
          email: data.email,
          password: data.password,
          userType: userType,
        },
      });
      
      if (!signUpResult?.user) {
        return status(400, createErrorResponse("Failed to create user account"));
      }

      return status(201, createSuccessResponse({
        id: signUpResult.user.id,
        name: signUpResult.user.name,
        email: signUpResult.user.email,
        userType: (signUpResult.user as { userType?: string }).userType || userType,
        emailVerified: signUpResult.user.emailVerified,
        createdAt: signUpResult.user.createdAt.toISOString(),
      }));
    } catch (error: unknown) {
      console.error("Sign up error:", error);
      throw status(500, createErrorResponse("Internal server error"));
    }
  }

  static async signUpDriver(data: DriverSignUpBody) {
    try {
      const existingUser = await SignUpRepository.findByEmail(data.email);
      if (existingUser) {
        return status(409, createErrorResponse("User with this email already exists"));
      }

      const signUpResult = await auth.api.signUpEmail({
        body: {
          name: data.name,
          email: data.email,
          password: data.password,
          userType: "driver",
        },
      });
      
      if (!signUpResult?.user) {
        return status(400, createErrorResponse("Failed to create user account"));
      }

      return status(201, createSuccessResponse({
        id: signUpResult.user.id,
        name: signUpResult.user.name,
        email: signUpResult.user.email,
        userType: (signUpResult.user as { userType?: string }).userType || "driver",
        emailVerified: signUpResult.user.emailVerified,
        createdAt: signUpResult.user.createdAt.toISOString(),
      }));
    } catch (error: unknown) {
      console.error("Driver sign up error:", error);
      throw status(500, createErrorResponse("Internal server error"));
    }
  }
}


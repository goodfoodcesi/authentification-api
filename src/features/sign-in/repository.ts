import { createErrorResponse } from "@/utils/api-response";
import { db } from "@/db";
import { user } from "@/db/schemas/auth.schema";
import { eq } from "drizzle-orm";
import { status } from "elysia";

export abstract class SignInRepository {
  static async findByEmail(email: string) {
    try {
      const [foundUser] = await db
        .select()
        .from(user)
        .where(eq(user.email, email))
        .limit(1);

      return foundUser || null;
    } catch (error) {
      throw status(500, createErrorResponse("Internal server error"));
    }
  }
}


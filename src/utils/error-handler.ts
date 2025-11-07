import { Elysia } from "elysia";
import { createErrorResponse } from "./api-response";

function extractPossibleValues(error: any): string[] {
  try {
    if (error.schema?.anyOf) {
      return error.schema.anyOf
        .filter((item: any) => item.const !== undefined)
        .map((item: any) => item.const);
    }
    return [];
  } catch {
    return [];
  }
}

export function handleError({ code, error, set }: any) {
  if (code === "VALIDATION") {
    set.status = 422;
    const validationError = error as any;
    const errors: string[] = [];

    if (validationError.errors && validationError.errors.length > 0) {
      for (const err of validationError.errors) {
        const field = err.path?.replace("/", "") || "field";
        if (err.message === "Expected required property") {
          errors.push(`The field '${field}' is required`);
        } else if (err.message === "Expected union value") {
          const possibleValues = extractPossibleValues(err);
          if (possibleValues.length > 0) {
            errors.push(
              `The field '${field}' must be one of: ${possibleValues.join(", ")}`,
            );
          } else {
            errors.push(`The field '${field}' has an invalid value`);
          }
        } else {
          errors.push(`${field}: ${err.message || "Invalid value"}`);
        }
      }
    } else if (validationError.all && validationError.all.length > 0) {
      for (const err of validationError.all) {
        const field = err.path?.replace("/", "") || "field";
        if (err.message === "Expected required property") {
          errors.push(`The field '${field}' is required`);
        } else if (err.message === "Expected union value") {
          const possibleValues = extractPossibleValues(err);
          if (possibleValues.length > 0) {
            errors.push(
              `The field '${field}' must be one of: ${possibleValues.join(", ")}`,
            );
          } else {
            errors.push(`The field '${field}' has an invalid value`);
          }
        } else {
          errors.push(`${field}: ${err.message || "Invalid value"}`);
        }
      }
    } else if (validationError.summary) {
      errors.push(validationError.summary);
    } else if (validationError.message) {
      errors.push(validationError.message);
    } else {
      errors.push("Validation error");
    }

    const mainMessage = errors.length === 1 ? errors[0] : "Validation failed";
    return createErrorResponse(
      mainMessage!,
      errors.length > 1 ? errors : undefined,
    );
  }

  if (code === "NOT_FOUND") {
    set.status = 404;
    return createErrorResponse("Route not found");
  }

  if (code === "PARSE") {
    set.status = 400;
    return createErrorResponse("Invalid JSON format");
  }

  if (code === "INTERNAL_SERVER_ERROR") {
    set.status = 500;
    console.error("Internal server error:", error);
    return createErrorResponse("Internal server error");
  }

  set.status = 500;
  const errorMessage =
    error instanceof Error ? error.message : "An error occurred";
  console.error("Unhandled error:", error);
  return createErrorResponse(errorMessage);
}

export const errorMiddleware = new Elysia({ name: "error-middleware" }).onError(
  handleError,
);

export function createErrorHandler() {
  return handleError;
}


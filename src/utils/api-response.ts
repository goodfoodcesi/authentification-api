import { t } from "elysia";

export interface ApiSuccessResponse<T> {
  data: T;
  timestamp: Date;
}

export interface ApiErrorResponse {
  error: string;
  details?: string[];
  timestamp: Date;
}

export const apiErrorResponse = t.Object({
  error: t.String(),
  details: t.Optional(t.Array(t.String())),
  timestamp: t.Date(),
});

export function createSuccessResponse<T>(data: T): ApiSuccessResponse<T> {
  return {
    data,
    timestamp: new Date(),
  };
}

export function createErrorResponse(error: string, details?: string[]): ApiErrorResponse {
  return {
    error,
    details,
    timestamp: new Date(),
  };
}

export function createEntityResponse<T>(entitySchema: T) {
  return {
    data: entitySchema,
    timestamp: new Date(),
  };
}


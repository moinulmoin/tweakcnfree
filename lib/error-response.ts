import {
  MyErrorResponseType,
  SubscriptionRequiredError,
  UnauthorizedError,
  ValidationError,
} from "@/types/errors";
import { logError } from "./shared";

function jsonError(
  code: MyErrorResponseType["code"],
  message: MyErrorResponseType["message"],
  data: MyErrorResponseType["data"],
  status: MyErrorResponseType["status"]
): Response {
  const response: MyErrorResponseType = { code, message, data, status };
  return new Response(JSON.stringify(response), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function isAIProviderRateLimitError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const err = error as unknown as Record<string, unknown>;

  if (typeof err.statusCode === "number" && err.statusCode === 429) {
    return true;
  }

  const message = error.message?.toLowerCase() ?? "";
  return message.includes("rate limit") || message.includes("too many requests");
}

export function handleError(error: unknown, context: Record<string, unknown> = {}): Response {
  if (error instanceof ValidationError) {
    return jsonError("VALIDATION_ERROR", error.message, { details: error.details }, 400);
  }

  if (error instanceof SubscriptionRequiredError) {
    return jsonError("SUBSCRIPTION_REQUIRED", error.message, error.data, 402);
  }

  if (error instanceof UnauthorizedError) {
    return jsonError("UNAUTHORIZED", error.message, undefined, 401);
  }

  if (isAIProviderRateLimitError(error)) {
    return jsonError(
      "AI_PROVIDER_UNAVAILABLE",
      "AI service is temporarily busy. Please try again in a few minutes.",
      undefined,
      429
    );
  }

  logError(error as Error, context);
  return new Response("Internal Server Error", { status: 500 });
}

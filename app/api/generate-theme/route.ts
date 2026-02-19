import { recordAIUsage } from "@/actions/ai-usage";
import { THEME_GENERATION_TOOLS } from "@/lib/ai/generate-theme/tools";
import { GENERATE_THEME_SYSTEM } from "@/lib/ai/prompts";
import { baseProviderOptions, myProvider } from "@/lib/ai/providers";
import { handleError, isAIProviderRateLimitError } from "@/lib/error-response";
import { getCurrentUserId, logError } from "@/lib/shared";
import { validateSubscriptionAndUsage } from "@/lib/subscription";
import { AdditionalAIContext, ChatMessage } from "@/types/ai";
import { SubscriptionRequiredError } from "@/types/errors";
import { convertMessagesToModelMessages } from "@/utils/ai/message-converter";
import { createUIMessageStream, createUIMessageStreamResponse, stepCountIs, streamText } from "ai";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId(req);

    const subscriptionCheck = await validateSubscriptionAndUsage(userId);

    if (!subscriptionCheck.canProceed) {
      throw new SubscriptionRequiredError(subscriptionCheck.error, {
        requestsRemaining: subscriptionCheck.requestsRemaining,
      });
    }

    const { messages }: { messages: ChatMessage[] } = await req.json();
    const modelMessages = await convertMessagesToModelMessages(messages);

    const stream = createUIMessageStream<ChatMessage>({
      onError: (error) => {
        console.error("[generate-theme] stream error:", error);
        if (isAIProviderRateLimitError(error)) {
          return "AI service is temporarily busy. Please try again in a few minutes.";
        }
        return "Failed to generate theme. Please try again.";
      },
      execute: ({ writer }) => {
        const context: AdditionalAIContext = { writer };
        const model = myProvider.languageModel("base");

        const result = streamText({
          abortSignal: req.signal,
          model: model,
          providerOptions: baseProviderOptions,
          system: GENERATE_THEME_SYSTEM,
          messages: modelMessages,
          tools: THEME_GENERATION_TOOLS,
          stopWhen: stepCountIs(3),
          onError: (error) => {
            console.error("[generate-theme] streamText error:", error);
          },
          onFinish: async (result) => {
            const { totalUsage } = result;
            try {
              await recordAIUsage({
                modelId: model.modelId,
                promptTokens: totalUsage.inputTokens,
                completionTokens: totalUsage.outputTokens,
              });
            } catch (error) {
              logError(error as Error, { action: "recordAIUsage", totalUsage });
            }
          },
          experimental_context: context,
        });

        writer.merge(
          result.toUIMessageStream({
            messageMetadata: ({ part }) => {
              if (part.type === "tool-result" && part.toolName === "generateTheme") {
                return { themeStyles: part.output };
              }
            },
          })
        );
      },
    });

    return createUIMessageStreamResponse({ stream });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === "AbortError" || error.name === "ResponseAborted")
    ) {
      return new Response("Request aborted by user", { status: 499 });
    }

    return handleError(error, { route: "/api/generate-theme" });
  }
}

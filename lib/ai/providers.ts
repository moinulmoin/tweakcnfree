import "server-only";

import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { customProvider } from "ai";

const glm = createOpenAICompatible({
  name: "glm",
  baseURL: process.env.GLM_BASE_URL ?? "https://api.z.ai/api/coding/paas/v4",
  apiKey: process.env.GLM_API_KEY!,
  // Tell the SDK we support structured outputs so it doesn't warn about responseFormat.
  // Then downgrade json_schema → json_object since Z.ai doesn't support json_schema.
  supportsStructuredOutputs: true,
  transformRequestBody: (body) => {
    const { response_format, ...rest } = body;
    if (response_format?.type === "json_schema") {
      return { ...rest, response_format: { type: "json_object" } };
    }
    return body;
  },
});

export const baseProviderOptions = {};

export const myProvider = customProvider({
  languageModels: {
    base: glm.chatModel(process.env.GLM_BASE_MODEL_ID ?? "glm-4.6v"),
    "theme-generation": glm.chatModel(process.env.GLM_THEME_MODEL_ID ?? "glm-4.7"),
    "prompt-enhancement": glm.chatModel(process.env.GLM_PROMPT_MODEL_ID ?? "glm-4.7-flash"),
  },
});

import "server-only";

import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { customProvider } from "ai";

const llm = createOpenAICompatible({
  name: "llm",
  baseURL: process.env.LLM_BASE_URL ?? "https://api.novita.ai/openai",
  apiKey: process.env.LLM_API_KEY!,
});

export const baseProviderOptions = {};

export const myProvider = customProvider({
  languageModels: {
    base: llm.chatModel(process.env.LLM_BASE_MODEL_ID!),
    "theme-generation": llm.chatModel(process.env.LLM_THEME_MODEL_ID!),
    "prompt-enhancement": llm.chatModel(process.env.LLM_PROMPT_MODEL_ID!),
  },
});

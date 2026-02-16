import "server-only";

import { createZhipu } from "zhipu-ai-provider";
import { customProvider } from "ai";

const zhipu = createZhipu({
  baseURL: process.env.GLM_BASE_URL ?? "https://api.z.ai/api/paas/v4",
  apiKey: process.env.GLM_API_KEY!,
});

export const baseProviderOptions = {};

export const myProvider = customProvider({
  languageModels: {
    base: zhipu(process.env.GLM_BASE_MODEL_ID ?? "glm-4.6v"),
    "theme-generation": zhipu(process.env.GLM_THEME_MODEL_ID ?? "glm-4.7"),
    "prompt-enhancement": zhipu(process.env.GLM_PROMPT_MODEL_ID ?? "glm-4.7-flash"),
  },
});

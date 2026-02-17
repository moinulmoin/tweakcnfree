import { themeStylesOutputSchema } from "@/lib/ai/generate-theme";
import { baseProviderOptions, myProvider } from "@/lib/ai/providers";
import { AdditionalAIContext } from "@/types/ai";
import { Output, streamText, tool } from "ai";
import z from "zod";

export const THEME_GENERATION_TOOLS = {
  generateTheme: tool({
    description: `Generates a complete shadcn/ui theme (light and dark) based on the current conversation context. Use this tool once you have a clear understanding of the user's request, which may include a text prompt, images, an SVG, or a base theme reference (@[theme_name]).`,
    inputSchema: z.object({}),
    outputSchema: themeStylesOutputSchema,
    execute: async (_input, { messages, abortSignal, toolCallId, experimental_context }) => {
      const { writer } = experimental_context as AdditionalAIContext;

      const { partialOutputStream, output } = streamText({
        abortSignal,
        model: myProvider.languageModel("theme-generation"),
        providerOptions: baseProviderOptions,
        output: Output.object({
          schema: themeStylesOutputSchema,
        }),
        messages,
      });

      for await (const chunk of partialOutputStream) {
        writer.write({
          id: toolCallId,
          type: "data-generated-theme-styles",
          data: { status: "streaming", themeStyles: chunk },
          transient: true,
        });
      }

      const themeStyles = await output;

      writer.write({
        id: toolCallId,
        type: "data-generated-theme-styles",
        data: { status: "ready", themeStyles },
        transient: true,
      });

      return themeStyles;
    },
  }),
};

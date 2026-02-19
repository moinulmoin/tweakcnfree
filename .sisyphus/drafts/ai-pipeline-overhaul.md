# Draft: AI Pipeline Overhaul

## Context (from last session analysis)
- tweakcn = shadcn/ui visual theme editor, self-hosted fork
- Last session: 26hr, 673 messages — cascading regression from dependency upgrade
- 7 bugs fixed (panels, hooks, charts, AI schema, provider), but root issues remain
- Core problem: AI pipeline is fragile, band-aided together across multiple emergency fixes

## Known Architecture (pre-research)
- Provider: `@ai-sdk/openai` → OpenAI-compatible endpoint (novita.ai default)
- Models: base, vision-base, theme-generation, prompt-enhancement
- Flow: Client hooks → API route → streamText + tool call → theme JSON
- Tool: `generateTheme` — empty input, uses conversation context, returns theme object via structured output
- Streaming: partial theme objects streamed to client during generation
- Images: sent as `file` parts with mediaType (new uncommitted approach)
- Message conversion: was custom `convertMessagesToModelMessages`, now using AI SDK's `convertToModelMessages`

## Known Problems
1. **Tool call reliability**: Model sometimes returns theme JSON as inline text instead of calling the tool
2. **Provider fragility**: Migrated GLM → @ai-sdk/openai-compatible → @ai-sdk/openai in rapid succession
3. **Error recovery**: Single retry via `generateText` fallback when schema parse fails
4. **Uncommitted work**: 6 files modified but not committed (provider rename + message handling rewrite)
5. **Dead code**: message-converter.ts still exports `buildUserContentPartsFromPromptData` which may be unused after rewrite

## Requirements (confirmed)
- User wants: comprehensive AI pipeline overhaul (not just patches)

## Technical Decisions
- (pending research results)

## Research Findings
- (3 agents running: pipeline map, types/schemas, AI SDK v6 best practices)

## Open Questions
- What LLM provider(s) should the overhaul support? (just OpenAI-compatible? Multiple?)
- What's the desired behavior when tool call fails? (retry? fallback text? error?)
- Is the current tool architecture (model calls generateTheme tool → nested model call for JSON) the right approach?
- Should prompt enhancement also be overhauled, or just theme generation?
- Image handling: is the current approach sufficient, or does it need work?
- Is there a preference for specific models/providers to target?

## Scope Boundaries
- INCLUDE: (to be defined)
- EXCLUDE: (to be defined)

import { createOpenAI as createGroq } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

import { createOllama } from "ollama-ai-provider";

const groq = createGroq({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
});
const google = createGoogleGenerativeAI({
  apiKey: import.meta.env.VITE_GOOGLE,
});

const gemini = google("models/gemini-1.5-flash");

const ollama = createOllama();

const llama = groq("llama-3.1-70b-versatile");
const llama8 = groq("llama-3.1-8b-instant");

const gemma_7b = groq("gemma-7b-it");

const codeqwen = ollama("codeqwen");

export { llama, codeqwen, llama8, gemma_7b, gemini };

// import { streamText } from "ai";
// import { openai } from "@ai-sdk/openai";
// // import { createStreamableValue } from "ai/rsc";

// export async function generate(input = "hola quiero texto", model) {
//   const stream = createStreamableValue("");

//   (async () => {
//     const { textStream } = await streamText({
//       model: model,
//       prompt: input,
//     });

//     for await (const delta of textStream) {
//       stream.update(delta);
//     }

//     stream.done();
//   })();

//   return { output: stream.value };
// }

import { generateObject } from "ai";
import { feedBackPrompt } from "./prompts";
import { generateText } from "ai";

export const genMetadata = async (target, headPrompt, schema, model) => {
  const prompt = `
    ${headPrompt}
    ${target}
    `;
  // console.log(prompt);
  const { object } = await generateObject({
    model: model,
    prompt: prompt,
    schema: schema,
  });
  return object;
};

export const genFeeback = async (cv, position, model) => {
  const { text } = await generateText({
    model: model,
    system: `
    Eres un reclutador profesional, y estas ayudando a a un candidato a mejorar su perfil para un puesto de trabajo tomando en consideracion su cv
    `,
    prompt: `
    ${feedBackPrompt}
    CV: 
    ${cv}
    Puesto de Trabajo:
    ${position}
    `,
  });
  return text;
};

// export const generateStreamFeeback = async (input, model) => {
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
// };

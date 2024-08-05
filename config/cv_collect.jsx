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

// Jobs
const genText = async (target, headPrompt, model) => {
  const prompt = `
  ${headPrompt}
  ${target}
  `;
  const { text } = await generateText({
    model: model,
    prompt: prompt,
  });
  return text;
};

export const genJobObject = async (jobText, model, schema) => {
  const prompt = `
  Clasifica la siguiente oferta laboral,

  - Descripcion laboral: un resumen de 100 palabras, debe estar relacionado a las actividades o rubro de la empresa, mas no presentaciones poco relevantes para el puesto
  - Habilidades requeridas - skills: entre tecnologicas y habilidades blandas, otras habilidades tambien
  - Responsabilidades del puesto de trabajo: la informacion redundante debe ser omitida
  - Experiencia: Experiencia del puesto laboral requerido
  - Educacion: educacion requerida para el puesto, si no hay coloca "Entry"

  INFORMACION LABORAL:
  ${jobText}
  `;
  const { object } = await generateObject({
    model: model,
    prompt: prompt,
    schema: schema,
  });
  return object;
};

export const genCVObject = async (cvText, model, schema) => {
  const prompt = `
  Clasifica el siguiente CV, si alguno no existe no inventes cosas en vez declara un " " para el objeto

  - Resumen: el about me, sobre me, resumen, si este no esta declarado explicitamente entonces crea uno que tome de referencia las habilidades, el ultimo grado de educacion alcanzado o el ultimo puesto de trabajo desarrollado, el que creas que tenga mayor relevancia, el total debe ser menor a 50 palabras.
  - Habilidades: debes tomar las hablidades declaradas explicitamente si alguno es redundante omitelo, si no existe explicitamente trata de inferir de acuerdo a las actividades desarrollas en puestos de trabajos anteriores o las descripciones de los proyectos realizados.
  - Educaction: la educacion, debe ser en el siguiente formato, grado, institucion, fecha, y descripcion si tiene
  - Experiencia: la experiencia laboral en el siguiente formato, posicion, empresa, fecha, actividades: ....
  - Proyectos: trata de enfocarte en las habilidades o descripcion de los proyectos, o que tecnologias usa.

  TEXTO DEL CV:
  ${cvText}

  `;
  const { object } = await generateObject({
    model: model,
    prompt: prompt,
    schema: schema,
  });
  return object;
};

export const genJobReference = async (jobText, model) => {
  const descriptionHead = `Genera la descripcion del puesto de trabajo, 
  si no existe trata de crearlo con la informacion de trabajo siguiente.
  y genera un resumen menor de 100 palabras con la informacion relevante.
  o solo coloca palabras clave que sea para identificar herramientas y conocimientos
  
  Informacion de puesto de trabajo:
  `;
  const job_description = await genText(descriptionHead, jobText, model);
  const skillHead = `
  Gemera las habilidades requeridas del puesto de trabajo, trata de encontrar palabras clave para el resultado o herramientas tecnologicas, si existe una habilidad y su descripcion, la descripcion resumelo con solamente palabras clave.
  
  INFORMACION DEL PUESTO DE TRABAJO:
  
  `;
  const job_skills = await genText(skillHead, jobText, model);

  const responHead = `
  Obten las responsabilidades que tiene el siguiente puesto de trabajo, retorna una lista, si existe la posibilidad de clasificar las responsabilidades por habilidades. pero si existe informacion redundante agrupalo con el que se parezca

  INFORMACION DEL PUESTO DE TRABAJO:
  `;

  const job_responsabilities = await genText(responHead, jobText, model);

  const experienceHead = `
  Obten la experiencia necesaria del puesto de trabajo. si no existe ningun requisito coloca "Entry", y presenta una lista, cada item debe tener menos de 10 palabras.
  
  
  INFORMACION DEL PUESTO DE TRABAJO:
  `;
  const job_experience = await genText(experienceHead, jobText, model);

  const educationHead = `
  Genera la educacion requerida o grado de intruccion requerida para el siguiente puesto de trabajo o el total de anios requeridos para el siguiente peusto de trabajo, si no existe un total de anios no coloques nada.
  
  
  INFORMACION DEL PUESTO DE TRABAJO:
  `;
  const job_educacion = await genText(educationHead, jobText, model);

  return {
    job: {
      job_description,
      job_skills,
      job_responsabilities,
      job_experience,
      job_educacion,
    },
  };
};

export const genCVReference = async (cvText, model) => {
  const headSummary = `
  Este es un CV, quiero extraer el "sobre me", o el "about me", si es que no existiera algo parecido, entonces crea un resumen de 20 palabras senalando sus habilidades y conocimientos
  
  TEXTO DEL CV:
  `;
  const cv_summary = await genText(headSummary, cvText, model);
  const headSkills = `
  De este texto de CV, quiero extraer las habilidades que tiene, considera la parte de habilidades si existe, si es que no existe explicitamente basate en las actividades del puesto de trabajo en los que estuvo anteriormente o de los proyectos que tiene y extrae palabras clave que pueden ser relevantes.

  TEXTO DEL CV:
  `;
  const cv_skills = await genText(headSkills, cvText, model);
  const headExp = `
  De este texto de CV, quiero extraer los puestos de trabajo que tuvo, en el siguiente formato. Empresa, posicion, fechas, y descripcion de todas las actividades realizadas (solo informacion relevante y no redundante)
  
  TEXTO DEL CV
  `;
  const cv_experience = await genText(headExp, cvText, model);
  const headProyects = `
  De este texto de CV, quiero extraer las habilidades o logros de los proyectos o actividades que realizo, o que es lo que hace el proyecto. presentalo en una lista.

  TEXTO DEL CV
  `;
  const cv_projects = await genText(headProyects, cvText, model);
  const headEdu = `
  De este texto de CV, quiero extraer la educacion que tiene, en el siguiente formato.
  Institucion, Grado obtenido, fecha, y descripcion logros si lo hubiese.
  `;
  const cv_education = await genText(headEdu, cvText, model);
  return {
    cv: {
      cv_summary,
      cv_skills,
      cv_experience,
      cv_education,
      cv_projects,
    },
  };
};

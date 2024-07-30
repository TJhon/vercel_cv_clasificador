import { useState } from "react";
import "./App.css";

// AI
import { genMetadata } from "./config/cv_collect";
import { gemini } from "./config/models";

import { cvPrompt, jobPrompt } from "./config/prompts";
import { cvSchema, jobSchema } from "./config/schema";

import { generateText } from "ai";

function App() {
  const [loading, setLoading] = useState(false);

  const [jobText, setJobText] = useState(null);
  const [jobObj, setJobObj] = useState({});
  const [cvtext, setCvtext] = useState(null);
  const [cvObj, setCVObj] = useState({});

  const [feedback, setFeedback] = useState("");

  async function classifyJob() {
    setLoading(true);
    console.log("Running Ai - Job");
    try {
      const resultsObj = await genMetadata(
        jobText,
        jobPrompt,
        jobSchema,
        gemini
      );
      setLoading(false);
      setJobObj(resultsObj);
      console.log(jobObj);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }
  async function classifyCV() {
    setLoading(true);
    console.log("Running Ai - CV");
    try {
      // console.log(cvPrompt);
      const resultsObj = await genMetadata(cvtext, cvPrompt, cvSchema, gemini);
      setLoading(false);
      setCVObj(resultsObj);
      console.log(cvObj);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  async function runFeedback() {
    // matches
    // Experiencia: job: Experience | cv: projects, experience, aboutme_summary
    // Education: job: education | cv: education, aboutme_summary
    // Skills: job: skills | cv: skills, aboutme_summary, projects
    // Responsabilidades: job: responsibilities, description | cv: projects, experience, aboutme_summary
    const listJoin = "\n\t   -";
    setLoading(true);
    console.log("Running Ai - Feedback");
    // Job Data
    const job_experience =
      jobObj?.experience || "No Experiencia previa requerida";
    const job_skill =
      jobObj?.skills.join(listJoin) || "No habilidades tecnicas requeridas";
    // const job_education =
    //   jobObj?.education.join(listJoin) || "No educación requerida";
    const { job_title, job_description } = jobObj;

    const cv_exp = cvObj?.experience
      .map(
        (exp) =>
          `Posición: ${
            exp.position
          }, Actividades realizadas: ${exp?.description.join(listJoin)} (${
            exp.date
          })`
      )
      .join("\n ");
    // CV data
    const cv_me = cvObj?.aboutme_summary || "";
    const cv_projects =
      cvObj?.projects
        .map(
          (proj) =>
            `Nombre del Proyecto: ${proj.name}, Actividades: ${proj.description}`
        )
        .join(listJoin) || "";

    const cv_skills = cvObj?.skills.join(listJoin) || "";
    // const cv_education = cvObj?.education.join(listJoin) || "Autodidacta";

    async function createRecomendation(job_items, cv_items, title, job_title) {
      const job_item = job_items.join("\n");
      const cv_item = cv_items.join("\n");
      const prompt = `
      Quiero que des recomendaciones que se puede modificar o tratar de incluir en el CV, si
      Estoy postulando al siguiente trabajo con los siguientes requisitos. Las recomendaciones no deben ser mayor a 50 palabras, debes limitarte a analizar a la siguiente informacion dada. Para el formato de salida califica el perfil al costado del title de 0 a 100, donde 0 es el peor perfil y 100 es el mejor.

      Titulo del Trabajo: ${job_title}

  
      # Oferta de Trabajo
        - ${title}: ${job_item}

      # CV - Actual  
        - ${title}: 
            ${cv_item}
  
      El Formato de salida debe ser de la siguiente manera, solo incluye el titulo y las recomendaciones que estan en 3 puntos:
      
      ## ${title}: {Aqui el Score para este titulo} / 100 \n

         - ...\n
         - ...\n
      `;
      const { text } = await generateText({
        model: gemini,
        prompt,
        system:
          "Eres un reclutador profesional y estas ayudando a a un candidato a mejorar su perfil para un puesto de trabajo tomando en consideracion su cv",
      });
      return text;
    }
    setFeedback("");
    const expRecomendation = await createRecomendation(
      [job_experience],
      [cv_projects, cv_exp, cv_me],
      "Experiencia",
      job_title
    );

    setFeedback((prev) => `${prev}\n${expRecomendation}`);

    const skillRecomendation = await createRecomendation(
      [job_skill],
      [cv_projects, cv_exp, cv_skills],
      "Habilidades - Skills",
      job_title
    );
    setFeedback((prev) => `${prev}\n${skillRecomendation}`);

    const activitiesRecomendation = await createRecomendation(
      [job_skill, job_description],
      [cv_projects, cv_exp, cv_me],
      "Actividades - Responsabilidades",
      job_title
    );

    setFeedback((prev) => `${prev}\n${activitiesRecomendation}`);

    setLoading(false);
  }

  return (
    <>
      <div className="cv">
        <h2>CV</h2>
        <textarea type="text" onChange={(e) => setCvtext(e.target.value)} />
        <button
          onClick={() => {
            classifyCV();
          }}
          disabled={loading}
        >
          Generate CV
        </button>
      </div>
      <div className="job">
        <h2>Job Description</h2>
        <textarea type="text" onChange={(e) => setJobText(e.target.value)} />
        <button
          onClick={() => {
            classifyJob();
          }}
          disabled={loading}
        >
          Generate Job
        </button>
      </div>
      <button onClick={() => runFeedback()}>Generate Feeback</button>

      <div>{feedback}</div>
    </>
  );
}

export default App;

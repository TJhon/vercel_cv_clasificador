import { useState } from "react";
import "./App.css";

// AI
import {
  genMetadata,
  genJobReference,
  genCVReference,
  genJobObject,
  genCVObject,
} from "./config/cv_collect";
import { gemini, llama } from "./config/models";

import { cvPrompt, jobPrompt } from "./config/prompts";
import {
  cvSchema,
  jobSchema,
  simpleJobSchema,
  simpleCVSchena,
} from "./config/schema";

import { generateText } from "ai";
import { readStreamableValue } from "ai/rsc";

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
      // const { job } = await genJobReference(jobText, llama8);
      const newJob = await genJobObject(jobText, gemini, simpleJobSchema);
      setLoading(false);
      setJobObj(newJob);
      console.log({ newJob });
      // console.log(jobObj);
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
      // const { cv } = await genCVReference(cvtext, gemini);
      const newCV = await genCVObject(cvtext, llama, simpleCVSchena);
      setLoading(false);
      console.log(newCV);
      setCVObj(newCV);
      // console.log(cvObj);
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

    const {
      cv_aboutme_summary,
      cv_skills,
      cv_education,
      cv_experiencia,
      cv_proyects,
    } = cvObj;
    const {
      job_description,
      job_skills,
      job_responsabilities,
      job_experiencia,
      job_education,
    } = jobObj;

    // const cv_education = cvObj?.education.join(listJoin) || "Autodidacta";

    async function createRecomendation(job_items, cv_items, title) {
      const job_item = job_items.join("\n");
      const cv_item = cv_items.join("\n");
      const prompt = `
      Quiero que des recomendaciones que se puede modificar o tratar de incluir en el CV, si
      Estoy postulando al siguiente trabajo con los siguientes requisitos. Las recomendaciones no deben ser mayor a 50 palabras, debes limitarte a analizar a la siguiente informacion dada. Para el formato de salida califica el perfil al costado del title de 0 a 100, donde 0 es el peor perfil y 100 es el mejor.
      Si se esta analizando educacion solo menciona si cumple o no con los requisitos minimos de ello y anima a que todavia intente postular y que puede demostrar sus conocimientos en una prueba tecnica (omite el formato de salida sugerido a contiacuion para educacion)

      Adicionalmente si ya tiene estas recomendaciones no las incluyas por que es redudante y tampoco imprimas estas recomendaciones: RECOMENDACIONES ANTERIORES: ${feedback}
  
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
      setFeedback((prev) => `${prev}\n${text}`);
      return text;
    }
    setFeedback("");
    await createRecomendation(
      [job_experiencia, job_description],
      [cv_proyects, cv_experiencia, cv_aboutme_summary],
      "Experiencia"
    );
    await createRecomendation(
      [job_skills],
      [cv_proyects, cv_experiencia, cv_skills],
      "Habilidades - Skills"
    );
    await createRecomendation(
      [job_skills, job_responsabilities],
      [cv_proyects, cv_experiencia, cv_aboutme_summary],
      "Actividades - Responsabilidades"
    );
    await createRecomendation(
      [job_education],
      [cv_education, cv_aboutme_summary],
      "Educacion"
    );

    setLoading(false);
  }

  // const genStream = () =>{
  //   generate("hola quiero texto variado de 20 palabras", ge)
  // }

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
      <button onClick={() => setFeedback("")}>Clean feedback</button>

      <div>{feedback}</div>
    </>
  );
}

export default App;

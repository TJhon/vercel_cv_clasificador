# cv feedback

# Salida de feedback

actualmente el output que genera

```js
const [feedback, setFeedback] = useState("");
// en feedback, esta en formato plano (markdown) y no es visible correctamente
<div>{feedback}</div>;
```

# .env

Se puede omitir la api de groq, ya que se esta usando google

```.env
VITE_GROQ_API_KEY=gsk_
VITE_GOOGLE=AIzaSxxxxxxxxxxx
```

# src

## Config

### cv collect

- genMetadata: genera metadatos (Clasifica) para el CV y el puesto de trabajo
- genFeedback: ---

### models

llamada a los servicios de AI de vercelAI, en este caso se esta usando, pero se tiene a los demas modelos por si se quiere hacer un selector de modelos (Detalle la clasificacion no es muy buena con llama3.1-8b y da errores -> se debe dar otro prompt)

```js
import { createGoogleGenerativeAI } from "@ai-sdk/google";
export const gemini = google("models/gemini-1.5-flash");
```

### promts

Prompts para clasificar el CV y el puesto de trabajo (para `gemini`)

### schema

schema para guardar los resultados de la clasificacion del cv

# App.jsx

## Generacion de objetos

- classifyJob(): genera el objeto para el trabajo
- classifyCV(): genera el objeto para el CV

## Feedback

siguiendo esta estructura de importancia para cada parte del puesto de trabajo

```
// matches
// Experiencia: job: Experience | cv: projects, experience, aboutme_summary
// Education: job: education | cv: education, aboutme_summary
// Skills: job: skills | cv: skills, aboutme_summary, projects
// Responsabilidades: job: responsibilities, description | cv: projects, experience, aboutme_summary
```

- runFeedback():
  - extrae la metadata y convierte en texto del puesto de trabajo y el cv.
  - `createRecomendation`: crea el prompt para la generacion del feedback para los matches (experiencia, skill, responsabilidades) y concatena con el feedback previo (simula un streaming)

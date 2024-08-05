export const jobPrompt = `

Clasifica la siguiente oferta de trabajo

Analiza la oferta de trabajo proporcionada y clasifícala según los siguientes criterios. Si algún campo no se corresponde con la información proporcionada, omítelo y muestra el objeto con "null".

Nota: Por favor, proporciona la salida en español. Si algún campo no se corresponde con la información proporcionada, omítelo.

Objeto de salida

- Título del trabajo: string
- Descripción del puesto: string (concisa)
- Habilidades necesarias: array de strings
- Experiencia necesaria: string
- Educación requerida: array de strings
- Responsabilidades: array de strings
- Beneficios: array de strings
- Localización: string
- Detalles adicionales: string (URL de postulación, plataforma, etc.)
- Warnings: string (detalles que pueden ser perjudiciales para el trabajador)
- Salario/Compensación: string (incluye cualquier tipo de compensación monetaria)
    `;

// export const cvPrompt = `
//       Clasifica el siguiente cv, si no logras detectar coloca un null
//       resumen o objetivo

//         `;

export const cvPrompt = `
Clasifica el siguiente CV

Analiza el CV proporcionado y clasifícalo según los siguientes criterios. Si no logras detectar algún campo, coloca un null en su lugar.

Nota: Por favor, proporciona la salida en español. Si algún campo no se corresponde con la información proporcionada, omítelo.

Objeto de salida

- Resumen o objetivo: string (aboutme_summary)
- Experiencia laboral: array de objetos con los siguientes campos:
  - Posición: string (position)
  - Empresa: string (company)
  - Fecha de inicio y final: string (date)
  - Descripción de las actividades: string (description)
- Habilidades/Skills: array de strings (incluye habilidades y skills)

  `;

const cvAditional = `
- Logros y certificaciones: array de objetos con los siguientes campos:
- Título: string (title)
  - Organización: string (organization)
  - Año: string (year)
  - Descripción: string (description)
  - Proyectos: array de objetos con los siguientes campos:
  - Título: string (title)
  - Organización: string (organization)
  - Fecha: string (date)
  - Descripción: string (description)
  - Referencias: array de objetos con los siguientes campos:
  - Nombre: string (name)
  - Título: string (title)
  - Contacto: string (contact)
  
- Información de contacto:
    - Nombre: string (info.name)
    - Correo electrónico: string (info.email)
    - Teléfono: string (info.phone)
    - Dirección: string (info.address)
    - LinkedIn: string (info.linkedin)
    - GitHub: string (info.github)
    - Portfolio: string (info.portfolio)
    - Sitio web: string (info.web)
    - Título académico: string (info.degree)
`;

export const feedBackPrompt = `
  Hola, califica  
  Que recomendaciones me puedes dar para mejorar mi perfil?
`;

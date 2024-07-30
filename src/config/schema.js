import { z } from "zod";

export const jobSchema = z.object({
  job_title: z.string().optional().describe("Job title"),
  job_description: z.string().describe("Job description"),
  skills: z.array(z.string()).describe("Skills required for the job"),
  experience: z.string().describe("Experience required for the job").optional(),
  education: z
    .array(z.string().describe("Education required for the job"))
    .optional(),

  resposabilities: z.array(z.string()).describe("Responsibilities of the job"),
  benefits: z.array(z.string()).describe("Benefits of the job").optional(),
  work_type: z
    .string()
    .describe(
      "Work type (full-time, remoto, presencial, mixto, etc) of the job"
    )
    .optional(),

  aditional_details: z
    .string()
    .optional()
    .describe(
      "Detalles a tener en cuenta, mensaje privado, o postulacion por alguna pagina en particular"
    ),
  warnings: z
    .string()
    .optional()
    .describe(
      "Red Flags de la oferta de trabajo, como osalario muy bajo, falta de claridad en las responsabilidades, trabajo excesivo, falta de oportunidades de crecimiento"
    ),
});

export const cvSchema = z.object({
  aboutme_summary: z.string().optional(),

  skills: z
    .array(z.string())
    .describe("Todas las habilidades que se puede encontrar"),
  experience: z.array(
    z
      .object({
        position: z.string().optional(),
        company: z.string().optional(),
        date: z.string().optional(),
        description: z.array(z.string()).optional(),
      })
      .describe("Todos los trabajos previos")
  ),
  projects: z.array(
    z.object({
      title: z.string().optional(),
      description: z.array(z.string()).optional(),
      date: z.string().optional(),
      organization: z.string().optional(),
    })
  ),
});

// export const cvSchema = z.object({
//   aboutme_summary: z.string().nullable().optional(),
// experience: z.array(
//   z.object({
//     position: z.string().nullable(),
//     company: z.string().nullable(),
//     date: z.string().nullable(),
//     description: z.string().nullable(),
//   })
// ),
// skills: z.array(z.string().nullable()),
// awards_and_certifications: z.array(
//   z.object({
//     title: z.string().nullable(),
//     organization: z.string().nullable(),
//     year: z.string().nullable(),
//     description: z.string().nullable(),
//   })
// ),
// projects: z.array(
//   z.object({
//     title: z.string().nullable(),
//     organization: z.string().nullable(),
//     date: z.string().nullable(),
//     description: z.string().nullable(),
//   })
// ),
// references: z.array(
//   z.object({
//     name: z.string().nullable(),
//     title: z.string().nullable(),
//     contact: z.string().nullable(),
//   })
// ),
// });

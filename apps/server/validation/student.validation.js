import { z } from "zod";

export const createStudentSchema = z.object({
  name: z.string().min(3),
  phone: z.string(),
  session: z.string(),
  email: z.email(),
  classRoll: z.string().min(6),
  group: z.string(),
});

import { z } from "zod";

export const createAuthSchema = z.object({
  name: z.string().min(3),
  email: z.email(),
  phone: z.string(),
  password: z.string(),
  tenant: z.string(),
  role: z.string(),
});

import { z } from "zod";

export const createAuthSchema = z.object({
  phone: z.string(),
  password: z.string(),
  tenant: z.string(),
});

import { z } from "zod";

export const createTenantSchema = z.object({
  name: z.string().min(3),
  eiin: z.string(),
  code: z.string(),
  organizationId: z.string(),
  email: z.email(),
  phone: z.string(),
});

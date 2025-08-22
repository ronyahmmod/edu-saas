import express from "express";
import tenantController from "../controllers/tenant.controller.js";
import { upload } from "../libs/multer.js";

const router = express.Router();

router.post(
  "/:id/logo",
  upload.single("logo"),
  tenantController.uploadTenantLogo
);

router.route("/").get(tenantController.getAll).post(tenantController.createOne);
router
  .route("/:id")
  .get(tenantController.getOne)
  .patch(tenantController.patchOne)
  .put(tenantController.updateOne)
  .delete(tenantController.deleteOne);

export default router;

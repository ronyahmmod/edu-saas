import express from "express";
import userController, {
  addPermission,
} from "../controllers/user.controller.js";
import {
  protect,
  requirePermission,
  restrictTo,
} from "../middlewares/auth.middleware.js";

const router = express.Router();
router.use(protect);

router
  .route("/")
  .get(restrictTo("admin", "super-admin"), userController.getAll);

router.patch(
  "/:id/deactivate",
  restrictTo("admin", "super-admin"),
  userController.deleteOne
);

router.delete(
  "/:id",
  protect,
  restrictTo("admin", "super-admin"),
  userController.deletePermanently
);

router.patch(
  "/:id/permissions",
  restrictTo("super-admin", "admin", "principal"),
  userController.updatePermissions
);

router.post(
  "/:id/permissions/add",
  restrictTo("admin", "super-admin", "principal"),
  addPermission
);
router.post(
  "/:id/permission/remove",
  restrictTo("admin", "super-admin", "principal"),
  userController.removePermission
);

export default router;

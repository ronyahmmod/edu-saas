import express from "express";
import addressController from "../controllers/address.controller.js";

const router = express.Router();

router
  .route("/divisions")
  .post(addressController.divisionFact.createOne)
  .get(addressController.divisionFact.getAll)
  .delete(addressController.divisionFact.deletePermanentlyALL);

router
  .route("/divisions/:id")
  .get(addressController.divisionFact.getOne)
  .put(addressController.divisionFact.updateOne)
  .delete(addressController.divisionFact.deletePermanently);

router
  .route("/districts")
  .post(addressController.districtFact.createOne)
  .get(addressController.districtFact.getAll)
  .delete(addressController.districtFact.deletePermanentlyALL);

router
  .route("/districts/:id")
  .get(addressController.districtFact.getOne)
  .put(addressController.districtFact.updateOne)
  .delete(addressController.districtFact.deletePermanently);

router
  .route("/upazilas")
  .post(addressController.upazilaFact.createOne)
  .get(addressController.upazilaFact.getAll)
  .delete(addressController.upazilaFact.deletePermanentlyALL);

router
  .route("/upazilas/:id")
  .get(addressController.upazilaFact.getOne)
  .put(addressController.upazilaFact.updateOne)
  .delete(addressController.upazilaFact.deletePermanently);

router
  .route("/postoffices")
  .post(addressController.postFact.createOne)
  .get(addressController.postFact.getAll)
  .delete(addressController.postFact.deletePermanentlyALL);

router
  .route("/postoffices/:id")
  .get(addressController.postFact.getOne)
  .put(addressController.postFact.updateOne)
  .delete(addressController.postFact.deletePermanently);
router
  .route("/unions")
  .post(addressController.unionFact.createOne)
  .get(addressController.unionFact.getAll)
  .delete(addressController.unionFact.deletePermanentlyALL);

router
  .route("/unions/:id")
  .get(addressController.unionFact.getOne)
  .put(addressController.unionFact.updateOne)
  .delete(addressController.unionFact.deletePermanently);
router
  .route("/pouroshovas")
  .post(addressController.pouroFact.createOne)
  .get(addressController.pouroFact.getAll)
  .delete(addressController.pouroFact.deletePermanentlyALL);

router
  .route("/pouroshovas/:id")
  .get(addressController.pouroFact.getOne)
  .put(addressController.pouroFact.updateOne)
  .delete(addressController.pouroFact.deletePermanently);

export default router;

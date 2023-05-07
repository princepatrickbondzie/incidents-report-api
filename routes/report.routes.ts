import express from "express";
import {
  createIncident,
  getIncidents,
  getIncidentsByCountry,
} from "../controllers/incident.controller";

const router = express.Router();

router.post("/incident", createIncident);
router.get("/incidents", getIncidents);
router.post("/incidents", getIncidentsByCountry);

export default router;

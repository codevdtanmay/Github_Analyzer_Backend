import express from "express"

import { analyzeRepo } from "../controllers/repo.controller.js"

const router = express.Router();
router.post('/', analyzeRepo)

export default router
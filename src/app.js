import express from "express"
import cors from "cors"
import repoRoutes from "./routes/repo.route.js"



const app = express();
app.use(cors());
app.use(express.static('public'))
app.use(express.json());
app.use('/api/analyze',repoRoutes)



export default app;

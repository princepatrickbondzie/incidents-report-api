import express, { Application } from "express";
import bodyParser from "body-parser";
import sequelize from "./db/db";
import incidentRoutes from "./routes/report.routes";
import cors from "cors";

const app: Application = express();
const PORT = process.env.PORT || 8080;

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// routes
app.use("/api", incidentRoutes);

// database connection
sequelize
  .authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err: Error) => console.log("Error: " + err));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

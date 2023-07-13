import * as express from "express";
import { Request, Response, NextFunction } from "express";
import { configDB } from "./config";
import { AppDataSource } from "./data-source";
import router from "./routes";

const PORT = configDB.port || 5000;

// establish database connection
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

// create and setup express app
const app = express();
app.use(express.json());

// Stop CORS errors
app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
  });

app.use(router);

// TODO Handle unknown routes

// start express server
app.listen(PORT, () => {
  console.log(`[Server]: Server is running on port ${PORT} 👍`);
});

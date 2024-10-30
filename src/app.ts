import express from "express";
import longifyRoute from "./routes/longifyRoute";
import shortifyRoutes from "./routes/shortifyRoute";

import rateLimiter from "./middleware/rateLimiter";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(rateLimiter.ipLogMiddleware);

app.get("/", (_req, res) => {
  res.send("Hello World!!");
});

app.use("/api", shortifyRoutes);
app.use("/api", longifyRoute);

app.listen(port, () => {
  console.log(`Express is listening at http://localhost:${port}`);
});

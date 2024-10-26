import express from "express";
import shortifyRoutes from "./routes/shortifyRoute";
import longifyRoute from "./routes/longifyRoute";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!!");
});

app.use("/api", shortifyRoutes);
app.use("/api", longifyRoute);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

import './config.js'; 
import express from "express";
import cors from "cors";
import errorHandler from "./middlewares/error.js";
import httpStatus from "http-status";
import newsRoutes from "./routes/news.js";

const port = process.env.BACKEND_PORT || 4000;

const app = express();

app.use(express.json());

// through cors, we have mentioned only to process req from this frontend URL
// our frontend URL - origin is fixed
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);

app.use("/api", newsRoutes);

app.use(errorHandler);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  //   next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
  res.status(httpStatus.NOT_FOUND).json({
    status: httpStatus.NOT_FOUND,
    message: "Page Not Found",
  });
});

app.listen(port, () => console.log(`Server started on port ${port}`));

export default app;

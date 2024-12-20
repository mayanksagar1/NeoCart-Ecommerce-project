// packages
import express from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";

// utilities
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";

dotenv.config();

connectDB();

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRouter);

app.listen(port, () => console.log("Server running on the Port : " + port));

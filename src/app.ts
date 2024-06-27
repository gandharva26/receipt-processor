// Import packages onto app
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

// Setup .env variables for app usage
dotenv.config();

// Import routes from the ./routes
import receipt from "@/routes/receipt-route";
import { verify } from "./middleware/auth-middleware";
import { errorResponse } from "./middleware/error-middleware";

// Setup constant variables
const PORT = 8000;
const RATE_TIME_LIMIT = Number(process.env.RATE_TIME_LIMIT) || 15;
const RATE_REQUEST_LIMIT = Number(process.env.RATE_REQUEST_LIMIT) || 100;

// Init express app
const app = express();

// Body parser
app.use(express.json());

// Detailed server logging
app.use(morgan("dev"));

// Limit rate of requests
// Alternatively, you can pass through specific routes for different limits based on route
app.use(
  rateLimit({
    windowMs: RATE_TIME_LIMIT * 60 * 1000,
    max: RATE_REQUEST_LIMIT,
  }),
);

// Enable CORS
app.use(cors());

// Setup routing with the a verify middleware that runs for all requests with "/receipts and passes control to receipt middleware"
app.use("/receipts", verify, receipt);

// Register custom error handler
app.use(errorResponse)

// Listen to specified port in .env or default 8000
app.listen(PORT || 8000, () => {
  console.log(`Server is listening on: ${PORT}`);
});

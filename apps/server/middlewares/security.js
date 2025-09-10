import helmet from "helmet";
import cors from "cors";
import mongoSanitize from "@exortek/express-mongo-sanitize";
import { xss } from "express-xss-sanitizer";
import hpp from "hpp";
import compression from "compression";
import morgan from "morgan";
import { rateLimit, ipKeyGenerator } from "express-rate-limit";
import RateLimitMongo from "rate-limit-mongo";
import express from "express";
import cookieParser from "cookie-parser";
const allowedOrigins = [
  "http://localhost:30001", // Next.js dev
  "https://your-frontend-domain.com", // your production domain
];

export const setupSecurity = (app) => {
  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }

  app.use(helmet());
  app.use(
    cors({
      origin: (origin, callback) => {
        console.log("Request Origin:", origin);
        // allow requests with no origin (like Insomnia, Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
      },
      credentials: true, // allow cookies
    })
  );
  app.use(cookieParser());
  app.use(express.json({ limit: "10kb" }));
  app.use(mongoSanitize());
  app.use(xss());
  app.use(hpp());
  app.use(compression());
};

export const createMongoRateLimiter = ({
  windowMs,
  max,
  message,
  keyPrefix = "",
} = {}) => {
  const store = new RateLimitMongo({
    uri: process.env.MONGO_URI,
    collectionName: "rate-limits",
    expireTimeMs: windowMs,
  });
  return rateLimit({
    windowMs,
    max,
    message: message,
    standardHeaders: true,
    legacyHeaders: false,
    store,
    keyGenerator: (req) => {
      // Use API key (or some other identifier) for authenticated users
      if (req.query.apiKey) return req.query.apiKey;

      // fallback to IP for unauthenticated users
      // return req.ip // vulnerable
      return ipKeyGenerator(req.ip); // better
    },
  });
};

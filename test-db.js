import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const conn = postgres("postgres://postgres:postgres@localhost:5432/rssagg"); // need to find proper URL
// let's instead run index.ts with modified error handler

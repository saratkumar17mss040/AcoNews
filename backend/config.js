import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

export const loadEnvironmentConfig = (dirname) => {
  const envFile =
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env.development";
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const envFilePath = path.join(__dirname, `${envFile}`);

  dotenv.config({
    path: path.resolve(process.cwd(), envFile),
  });

  console.log(`Loaded environment config from ${envFilePath}`);
};

// Automatically load environment config when this module is imported
loadEnvironmentConfig();

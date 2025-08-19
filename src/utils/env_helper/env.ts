import * as path from "path";
import { config as loadDotenv } from "dotenv";
import { z } from "zod";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../../../.env");

// Load .env file, overriding any existing process.env values
// Really important if monorepo
loadDotenv({ path: envPath, override: true });

/**
 * Validation schema for application environment variables.
 */
const schema = z.object({
    /**
     * Base URL for the application under test
     */
    BASE_URL: z.string().url(),

    /**
     * Base URL for the API of application under test
     */
    API_BASE_URL: z.string().url(),

    /**
     * Main user login credentials
     */
    MAIN_USER_LOGIN: z.string().min(1),
    MAIN_USER_PASSWORD: z.string().min(1),
});

/**
 * Parsed and validated environment variables.
 */
export const env = schema.parse(process.env);

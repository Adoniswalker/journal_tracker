import {cleanEnv, email, url, port, str, host} from "envalid";

const envVarsSchema = cleanEnv(process.env, {
    PORT: port(),
    DB_HOST: host(),
    DB_PORT: port(),
    DB_USERNAME: str(),
    DB_PASSWORD: str(),
    DB_DATABASE: str(),
    JWT_SECRET: str(),
    JWT_EXPIRATION: str(),
    WEB_HOST: host(),
    MAILGUN_KEY: str(),
    MAILGUN_DOMAIN: host(),
    MAILGUN_SENDER: str()
})
export default envVarsSchema;

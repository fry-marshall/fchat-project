import { Sequelize } from "sequelize";
import "dotenv/config";

console.log("process.env.DATABASE_NAME", process.env.DATABASE_NAME)
console.log("process.env.DATABASE_USERNAME", process.env.DATABASE_USERNAME)
console.log("process.env.DATABASE_PASSWORD", process.env.DATABASE_PASSWORD)

const sequelize = new Sequelize(
    process.env.DATABASE_NAME as string, 
    process.env.DATABASE_USERNAME as string, 
    process.env.DATABASE_PASSWORD, 
    {
        host: process.env.DATABASE_HOST as string,
        port: parseInt(process.env.MYSQLDB_DOCKER_PORT as string),
        dialect: 'mysql',
    }
);

export default sequelize;

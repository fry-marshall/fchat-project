import { Sequelize } from "sequelize";
import "dotenv/config";

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

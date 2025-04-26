import { Sequelize } from "sequelize";
import "dotenv/config";

const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE_NAME as string, 
    process.env.MYSQL_DATABASE_USERNAME as string, 
    process.env.MYSQL_ROOT_PASSWORD, 
    {
        host: process.env.MYSQL_DATABASE_HOST as string,
        port: parseInt(process.env.MYSQL_DOCKER_PORT as string),
        dialect: 'mysql',
    }
);

export default sequelize;

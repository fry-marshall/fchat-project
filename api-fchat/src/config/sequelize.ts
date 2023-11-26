import { Sequelize } from "sequelize";
import "dotenv/config";

const sequelize = new Sequelize(process.env.DATABASE_NAME as string, process.env.DATABASE_USERNAME as string, process.env.DATABASE_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
});

export default sequelize;

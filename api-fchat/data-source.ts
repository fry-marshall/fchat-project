import { Conversations } from 'src/messages/entities/conversations.entity';
import { Messages } from 'src/messages/entities/messages.entity';
import { Users } from 'src/users/users.entity';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  entities: [Users, Messages, Conversations],
  migrations: ['dist/migrations/*.js'],
});

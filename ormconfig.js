module.exports = {
  type: process.env.DB_DIALECT,
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/db/migration/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/db/migrations',
  },
  synchronize: true,
};

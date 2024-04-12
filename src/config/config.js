require('dotenv').config();

module.exports = {
  development: {
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    dialect: "postgres"
  },
  test: {
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    dialect: "postgres"
  },
  production: {
    username: process.env.PGUSERTEST,
    password: process.env.PGPASSWORDTEST,
    database: process.env.PGDATABASETEST,
    host: process.env.PGHOSTTEST,
    dialect: "postgres"
  }
};

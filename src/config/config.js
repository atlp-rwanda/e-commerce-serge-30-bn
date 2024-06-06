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
    username: process.env.PGUSERTEST,
    password: process.env.PGPASSWORDTEST,
    database: process.env.PGDATABASETEST,
    host: process.env.PGHOSTTEST,
    dialect: "postgres"
  },
  production: {
    username: process.env.PGUSERPROD,
    password: process.env.PGPASSWORDPROD,
    database: process.env.PGDATABASEPROD,
    host: process.env.PGHOSTPROD,
    dialect: "postgres"
  }
};

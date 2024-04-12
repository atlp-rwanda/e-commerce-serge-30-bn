
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const development = new Sequelize(process.env.PGDATABASE!, process.env.PGUSER!,process.env.PGPASSWORD!, {
    host: process.env.PGHOST!,
    dialect: 'postgres',
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
  });
  const production = new Sequelize(process.env.PGDATABASEPROD!, process.env.PGUSERPROD!,process.env.PGPASSWORDPROD!, {
    host: process.env.PGHOSTPROD!,
    dialect: 'postgres',
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
  });

  const testing = new Sequelize(process.env.PGDATABASETEST!, process.env.PGUSERTEST!,process.env.PGPASSWORDTEST!, {
    host: process.env.PGHOSTTEST!,
    dialect: 'postgres',
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
    });
 export { development, production,testing };


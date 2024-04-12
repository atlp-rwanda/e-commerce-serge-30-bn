[![Coverage Status](https://coveralls.io/repos/github/atlp-rwanda/e-commerce-serge-30-bn/badge.svg?branch=ch-setup-express-server-187364838)](https://coveralls.io/github/atlp-rwanda/e-commerce-serge-30-bn?branch=ch-setup-express-server-187364838)

E-commerce API
===============

This repository contains an E-commerce API built using Node.js, Express.js, PostgreSQL, and Sequelize. The API allows you to perform various operations such as creating, updating, and deleting products, categories, orders, and users.

Table of Contents
-----------------

* [Features](#features)
* [Getting Started](#getting-started)
* [Dependencies](#dependencies)
* [Folder Structure](#folder-structure)
* [Branch Naming](#branch-naming)
* [Swagger Documentation](#swagger-documentation)
* [Contributing](#contributing)
* [License](#license)


Getting Started
---------------

1. Clone the repository:
```bash
git clone https://github.com/atlp-rwanda/e-commerce-serge-30-bn.git
```
2. Change into the repository directory:
```bash
cd e-commerce-serge-30-bn
```
3. Install the dependencies:
```
npm install
```
4. Set up the environment variables. You can use the `.env.example` file as a reference. At a minimum, you'll need to set the `PORT` variable.
5. Start the server:
```
npm run server
```
Accessing the Application
-------------------------

Once the server is running, you can access the application by navigating to the specified URL in your web browser. By default, the application might be accessible at `http://localhost:3000/api/v1`, but this can vary depending on your configuration.

Database Configuration
----------------------

Copy the `.env.example` file and rename it to .env.
Update the `.env` file with your postgresSQL configuration settings.

Database Migration
------------------

1.Create migration file:
```
npx sequelize-cli migration:create --name <file-name>
```
2.Run Sequelize migration:
```
npx sequelize-cli db:migrate
```
3.Undo migration:
```
npx sequelize-cli db:migrate:undo
```

5.you can edit schema by editing migration file or by using seeders

* Create Seed file:
```
npx sequelize-cli seed:generate --name <name>
```
* Running seeds
```
npx sequelize-cli db:seed:all
```
* Undoing seeds
```
npx sequelize-cli db:seed:undo
```

Accessing the Application
-------------------------

Once the server is running, you can access the application by navigating to the specified URL in your web browser. By default, the application might be accessible at `http://localhost:3000/api/v1`, but this can vary depending on your configuration.

Database Configuration
----------------------

Copy the `.env.example` file and rename it to .env.
Update the `.env` file with your postgresSQL configuration settings.

Database Migration
------------------

1.Create migration file:
```
npx sequelize-cli migration:create --name <file-name>
```
2.Run Sequelize migration:
```
npx sequelize-cli db:migrate
```
3.Undo migration:
```
npx sequelize-cli db:migrate:undo
```

5.you can edit schema by editing migration file or by using seeders

* Create Seed file:
```
npx sequelize-cli seed:generate --name <name>
```
* Running seeds
```
npx sequelize-cli db:seed:all
```
* Undoing seeds
```
npx sequelize-cli db:seed:undo
```

Accessing the Application
-------------------------

Once the server is running, you can access the application by navigating to the specified URL in your web browser. By default, the application might be accessible at `http://localhost:3000/api/v1`, but this can vary depending on your configuration.

Database Configuration
----------------------

Copy the `.env.example` file and rename it to .env.
Update the `.env` file with your postgresSQL configuration settings.

Database Migration
------------------

1.Create migration file:
```
npx sequelize-cli migration:create --name <file-name>
```
2.Run Sequelize migration:
```
npx sequelize-cli db:migrate
```
3.Undo migration:
```
npx sequelize-cli db:migrate:undo
```

5.you can edit schema by editing migration file or by using seeders

* Create Seed file:
```
npx sequelize-cli seed:generate --name <name>
```
* Running seeds
```
npx sequelize-cli db:seed:all
```
* Undoing seeds
```
npx sequelize-cli db:seed:undo
```

Accessing the Application
-------------------------

Once the server is running, you can access the application by navigating to the specified URL in your web browser. By default, the application might be accessible at `http://localhost:3000/api/v1`, but this can vary depending on your configuration.

Database Configuration
----------------------

Copy the `.env.example` file and rename it to .env.
Update the `.env` file with your postgresSQL configuration settings.

Database Migration
------------------

1.Create migration file:
```
npx sequelize-cli migration:create --name <file-name>
```
2.Run Sequelize migration:
```
npx sequelize-cli db:migrate
```
3.Undo migration:
```
npx sequelize-cli db:migrate:undo
```

5.you can edit schema by editing migration file or by using seeders

* Create Seed file:
```
npx sequelize-cli seed:generate --name <name>
```
* Running seeds
```
npx sequelize-cli db:seed:all
```
* Undoing seeds
```
npx sequelize-cli db:seed:undo
```

Accessing the Application
-------------------------

Once the server is running, you can access the application by navigating to the specified URL in your web browser. By default, the application might be accessible at `http://localhost:3000/api/v1`, but this can vary depending on your configuration.

Database Configuration
----------------------

Copy the `.env.example` file and rename it to .env.
Update the `.env` file with your postgresSQL configuration settings.

Database Migration
------------------

1.Create migration file:
```
npx sequelize-cli migration:create --name <file-name>
```
2.Run Sequelize migration:
```
npx sequelize-cli db:migrate
```
3.Undo migration:
```
npx sequelize-cli db:migrate:undo
```

5.you can edit schema by editing migration file or by using seeders

* Create Seed file:
```
npx sequelize-cli seed:generate --name <name>
```
* Running seeds
```
npx sequelize-cli db:seed:all
```
* Undoing seeds
```
npx sequelize-cli db:seed:undo
```

Dependencies
------------

* [bcrypt](https://www.npmjs.com/package/bcrypt): Library to help you hash passwords.
* [cookie-parser](https://www.npmjs.com/package/cookie-parser): Middleware to parse cookies.
* [cors](https://www.npmjs.com/package/cors): Middleware to enable CORS.
* [dotenv](https://www.npmjs.com/package/dotenv): Loads environment variables from a `.env` file.
* [express](https://www.npmjs.com/package/express): Fast, unopinionated, minimalist web framework for Node.js.
* [joi](https://www.npmjs.com/package/joi): Object schema validation library.
* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken): Library to generate and verify JSON Web Tokens (JWT).
* [multer](https://www.npmjs.com/package/multer): Middleware for handling `multipart/form-data`, which is primarily used for uploading files.
* [nodemon](https://www.npmjs.com/package/nodemon): Development tool that helps you monitor for changes in your code and automatically restarts your server.
* [pg](https://www.npmjs.com/package/pg): Non-blocking PostgreSQL client for Node.js.
* [pg-hstore](https://www.npmjs.com/package/pg-hstore): Library to work with the hstore data type in PostgreSQL.
* [sequelize](https://www.npmjs.com/package/sequelize): Promise-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite, and Microsoft SQL Server.
* [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express): Swagger UI Express middleware.
* [Winston](https://www.npmjs.com/package/winston): Logger for Node.js.

Folder Structure
----------------

* `config/`: Configuration files for the API.
* `controllers/`: Controllers that handle the business logic for each route.
* `models/`: Sequelize models that define the structure of the database tables.
* `validation/`: Validation functions for request data.
* `helpers/`: Helper functions used throughout the API.
* `routes/`: Express routes that define the endpoints for the API.


Branch Naming
-------------

Branches created should be named using the following format:
```javascript
{story type}-{story summary}-{pivotal tracker/trello id}
```
* `story type`: Indicates the context of the branch and should be one of the following:
	+ `ft`: Feature
	+ `bg`: Bug
	+ `ch`: Chore
* `story summary`: Short 2-3 words summary about what the branch contains.
* `pivotal tracker/Trello story id`: The Id of the pivotal tracker/Trello story associated with the commit.

Example:
```
ft-resources-rest-endpoints-0408
```
For more information, see the [Engineering Playbook](https://github.com/atlp-rwanda/engineering-playbook/wiki/).

Swagger Documentation
---------------------
You can explore the API endpoints and their functionalities using Swagger UI at:

- [Development Server](http://localhost:8000/docs)
- [Staging Server](https://staging-e-commerce-serge-30-bn.onrender.com/docs)

Contributing
------------

Contributions are welcome! Please open an issue or a pull request to suggest changes or report bugs.

License
-------

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
[![Node.js CI](https://github.com/atlp-rwanda/e-commerce-serge-30-bn/actions/workflows/node.js.yml/badge.svg)](https://github.com/atlp-rwanda/e-commerce-serge-30-bn/actions/workflows/node.js.yml)
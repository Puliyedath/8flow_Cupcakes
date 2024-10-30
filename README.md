## Getting Started
A Nextjs app that includes CRUD api to add delete and retrieve cupcakes information. The Data is persisted in a document store (Mongo DB)

### Building the docker stack:
Run ```docker-compose up --build```
This will iniatiase a docker stack and add some dummy cupcake data to the mongo database

### Running the Unit Tests:
At the root of the app run,
- npm install
- npx jest

### Seed Data script
This script resides at the `/scripts/seed_data`, change the script to change the test data or the api user that the app uses to read and write to the cupcake store


### Running the API calls against the servers
- `docker-compose up --build`
-  Install an http client cli [client](https://httpie.io/cli)
- `http GET http://localhost:3000/api/v2/cupcake`
- `http POST http://localhost:3000/api/v2/cupcake   price:=5`
- `http POST http://localhost:3000/api/v2/cupcake   name="Vaniall Dream"`
- `http DELETE http://localhost:3000/api/v2/cupcake/abc`
- `http PUT http://localhost:3000/api/v2/cupcake  id=67215ad82f06a3cb5ca8b062 name="Vanilla Dream3"   price:=5`

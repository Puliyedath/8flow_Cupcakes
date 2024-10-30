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
- `/rest_calls.sh` (chmod +x to set the executable bit)

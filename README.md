# Express Mongoose Foundation
[![codecov](https://codecov.io/gh/IgorHybrid/express-mongoose-foundation/branch/master/graph/badge.svg?token=POI4MKMRPR)](https://codecov.io/gh/IgorHybrid/express-mongoose-foundation)

Express server using MongoDB with everything needed for an easy start. It has some features such as authentication using JWT, unit and integration testing, continuous integration etc. This project is going to be the foundation for the new upcoming projects I am going to build.

For emojis guide, I am using [gitmoji](https://gitmoji.dev/).

## Compatibility
This project is compatible with Nodejs versions between 16 and 19 both included.

## Quick start
Clone the repo:
```bash
git clone https://github.com/IgorHybrid/express-mongoose-foundation.git
```
Install dependencies:
```bash
npm install
```
Create .env file as below:
```bash
# Port number
PORT=3000

# URL of the Mongo DB
MONGO_URI=mongodb://127.0.0.1:27017/db-name

# JWT
# JWT secret key
JWT_SECRET=thisisasamplesecret
# Number of minutes after which an access token expires
JWT_ACCESS_EXPIRATION_MINUTES=30
# Number of days after which a refresh token expires
JWT_REFRESH_EXPIRATION_DAYS=30

CLIENT_URL=http://localhost:5000
```
## Commands
Run the project in dev mode:
```bash
npm run dev
```
Testing:

```bash
# run all tests
npm run test
# run test coverage
npm run test:coverage
```
## TODO
There are some features I am still working on:
- [ ] Email service for user validation
- [ ] Use swagger for api documentation
- [ ] Authentication by roles
- [ ] Logger
- [ ] Keep error stacks only for development
- [ ] Remove or replace deprecated packages


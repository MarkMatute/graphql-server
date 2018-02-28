const express = require('express');
const app = express();
const PORT = 3001;
const expressGraphQL = require('express-graphql');
const schema = require('./schema');

app.use('/graphql', expressGraphQL({
  schema: schema,
  graphiql: true
}));

module.exports = app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});

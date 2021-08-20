const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const path = require("path");

const { authMiddleware } = require("./utils/auth");
const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");

const PORT = process.env.PORT || 3001;
const app = express();
// create a new Apollo server and pass in our schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

// integrate our Apollo server with the Express application as middleware
async function startApolloServer() {
  await server.start();
  server.applyMiddleware({ app });
}
startApolloServer();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//serve up static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

// wildcard GET route for the server - if request without route defined made, respond with production-ready react front end
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    // log where we can go to test our GQL API
    console.log(`use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});

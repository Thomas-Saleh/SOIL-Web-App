import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql', // Ensure this matches your GraphQL server URI
  cache: new InMemoryCache()
});

export default client;

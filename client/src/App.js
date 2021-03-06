import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
//middleware function to retrieve token
import { setContext } from '@apollo/client/link/context';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import NoMatch from './pages/NoMatch';
import SingleThought from './pages/SingleThought';
import Profile from './pages/Profile';
import Signup from './pages/Signup';

//establish link to GraphQL server at /graphql endpoint with createHttpLink
const httpLink = createHttpLink({
  uri: '/graphql',
})

//use setContext() function to retrieve the token from localStorage and set the HTTP request headers of every request to include the token
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers, 
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

//instantiate the Apollo Client instance and create the connection to the API endpoint
const client = new ApolloClient({
  //every request retrieves the token and sets the request headers before making the request to the API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

//everything between the ApolloProvider tags will have access to the server's API data through {client}
// Router component makes all of the child components on the page aware of the client-side routing that can take place now.
function App() {
  return (
    <ApolloProvider client = {client}>
      <Router>
        <div className='flex-column justify-flex-start min-100-vh'>
          <Header />
          <div className='container'>
            <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/signup' component={Signup} />
            <Route exact path='/profile/:username?' component={Profile} />
            <Route exact path='/thought/:id' component={SingleThought} />
            <Route component={NoMatch} />
            </Switch>
          </div>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "react-apollo";
import { setContext } from "apollo-link-context";
import { I18nextProvider } from "react-i18next";
import { createUploadLink } from "apollo-upload-client";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";

import { split } from "apollo-link";

import { onError } from "apollo-link-error";

import "bootstrap-css-only/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "semantic-ui-css/semantic.min.css";

import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "./index.scss";
import i18n from "./i18n";

const cache = new InMemoryCache({
  dataIdFromObject: (o) => `${o.__typename}-${o.id}`,
});

const httpLink = new createUploadLink({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
});

console.log("QQQQQQQ", process.env.REACT_APP_GRAPHQL_WEBSOCKET);
const wsLink = new WebSocketLink({
  uri: process.env.REACT_APP_GRAPHQL_WEBSOCKET,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem("token"),
    },
  },
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) => {
      if (
        !message.includes(
          "You do not have permission to perform this action"
        ) &&
        !message.includes("could not convert string to float:") &&
        !message.includes(
          'Variable "$postId" of required type "ID!" was not provided.'
        )
      ) {
        // window.location.replace(SERVER_ERROR);
      } else {
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        );
      }
    });
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const authLink = setContext((_, { headers }) => {
  let data = JSON.parse(localStorage.getItem("token"));
  data = data && data.token === "token" ? "" : data;
  return {
    headers: {
      ...headers,
      authorization: data ? `Bearer ${data.token}` : "",
    },
  };
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  authLink.concat(httpLink)
);

const client = new ApolloClient({
  link: link, //errorLink.concat(authLink.concat(httpLink)),
  cache: cache.restore(window.__APOLLO_STATE__ || {}),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

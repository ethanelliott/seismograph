import VueApollo from "vue-apollo";
import ApolloClient from "apollo-client";
import {HttpLink} from 'apollo-link-http';
import {split} from 'apollo-link'
import {WebSocketLink} from 'apollo-link-ws';
import {getMainDefinition} from 'apollo-utilities'
import {InMemoryCache} from 'apollo-cache-inmemory'
import {env} from "../env";

const httpLink = new HttpLink({
    uri: env.graphqlUrl,
})

const wsLink = new WebSocketLink({
    uri: env.graphqlUrl.replace('http', 'ws'),
    options: {
        reconnect: true,
    },
})

const link = split(
    ({query}) => {
        const definition = getMainDefinition(query);
        return definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
    },
    wsLink,
    httpLink
)

export const apolloClient = new ApolloClient({
    link,
    cache: new InMemoryCache(),
});


export const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
    errorHandler: error => {
        if (!env.prod) {
            // eslint-disable-next-line no-console
            console.error(JSON.parse(JSON.stringify(error)).message);
        }
    }
});

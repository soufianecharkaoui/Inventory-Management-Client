import {NgModule} from '@angular/core';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import {HttpLinkModule, HttpLink} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { GC_AUTH_TOKEN } from './login/constants';
import { HttpHeaders } from '@angular/common/http';

const uri = 'http://localhost:4000/graphql';
export function createApollo(httpLink: HttpLink) {

  const middleware = new ApolloLink((operation, forward) => {
    const token = localStorage.getItem(GC_AUTH_TOKEN);
    if (token) {
      operation.setContext({
        headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
      });
    }
    return forward(operation);
  });
  
  return {
    link: middleware.concat(httpLink.create({uri})),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}

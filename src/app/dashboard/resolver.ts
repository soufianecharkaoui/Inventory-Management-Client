import {  Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Observable, forkJoin } from 'rxjs';
import { GET_AGENTS } from 'app/services/agents.graphql';
import { map, take } from 'rxjs/operators';
import { GET_TRANSACTIONS } from 'app/services/transactions.graphql';
import { GET_WAREHOUSES } from 'app/services/warehouses.graphql';
import { GET_PRODUCTS } from 'app/services/products.graphql';

@Injectable() 

export class DashboardResolver implements Resolve<any> { 


    constructor(private apollo: Apollo) { }
   
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any>|any {
        const agents = this.apollo.watchQuery({
            query: GET_AGENTS
        })
        .valueChanges.pipe(map((result: any) => result.data.getAgents.filter(agent => agent.isDeleted === false).map(agent => {
                    agent.transactions = agent.transactions.filter(transaction => transaction.isDeleted === false);
                    return agent
                 })), take(1))

        const warehouses = this.apollo.watchQuery({
            query: GET_WAREHOUSES
        })
        .valueChanges.pipe(map((result: any) => result.data.getWarehouses.filter(warehouse => warehouse.isDeleted === false).map(warehouse => {
                    warehouse.transactions = warehouse.transactions.filter(transaction => transaction.isDeleted === false);
                    return warehouse
                })), take(1))

        const transactions = this.apollo.watchQuery({
            query: GET_TRANSACTIONS
        })
        .valueChanges.pipe(map((result: any) => result.data.getTransactions.filter(transaction => transaction.isDeleted === false)), take(1))

        return forkJoin([
            agents,
            warehouses,
            transactions
        ]).pipe(map(([agents,warehouses,transactions]) => ({ agents, warehouses, transactions })), take(1));
    }

}
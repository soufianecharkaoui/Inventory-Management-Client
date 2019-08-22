import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/login/auth.service';
import { Apollo } from 'apollo-angular';
import { GET_USER } from 'app/services/users.graphql';
import { map } from 'rxjs/operators';
import { User } from 'app/types';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'pe-7s-graph', class: '' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  user: User;

  constructor(private authService: AuthService,
    private apollo: Apollo) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.apollo.watchQuery({
      query: GET_USER,
      variables: {
        id: this.authService.getUserId()
      }
    })
    .valueChanges.pipe(map((result: any) => result.data.getUser))
    .subscribe(data => this.user = data);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };

  logout() {
    this.authService.logout();
  }
}

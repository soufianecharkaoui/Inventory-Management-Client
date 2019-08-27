import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../types';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { AuthService } from './auth.service';
import { map, catchError } from 'rxjs/operators';
import { LOGIN, GET_USER } from 'app/services/users.graphql';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user: User;
  loginForm: FormGroup;
  error: string;

  @ViewChild('lform', {static: true}) loginFormDirective;

  constructor(private apollo: Apollo,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router) { }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  ngOnInit() {
    this.createForm();
  }

  login() {
    this.apollo.watchQuery({
      query: LOGIN,
      variables: {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      }
    })
    .valueChanges.pipe(map((result: any) => result.data.login))
    .subscribe(data => {
        this.authService.saveUserData(data.userId, data.token);
        this.apollo.watchQuery({
          query: GET_USER,
          variables: {
            id: data.userId
          }
        })
        .valueChanges.pipe(map((result: any) => result.data.getUser))
        .subscribe(data => {
            if (data.isAdmin) {
              this.router.navigate(['dashboard']);
            } else {
              this.router.navigate(['my-transactions']);
            }
          }
        );
      }
    );
    this.loginFormDirective.resetForm();
  }

}

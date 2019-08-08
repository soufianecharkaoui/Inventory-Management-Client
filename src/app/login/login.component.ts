import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../types';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import {GC_AUTH_TOKEN, GC_USER_ID} from './constants';
import { AuthService } from './auth.service';
import { LOGIN } from '../graphql';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user: User;
  loginForm: FormGroup;

  @ViewChild('lform', {static: true}) loginFormDirective;

  constructor(private apollo: Apollo,
    private fb: FormBuilder,
    private authService: AuthService) { }

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
    .subscribe(data => this.saveUserData(data.userId, data.token));
  }

  saveUserData(userId, token) {
    localStorage.setItem(GC_USER_ID, userId);
    localStorage.setItem(GC_AUTH_TOKEN, token);
    this.authService.setUserId(userId);
  }

}

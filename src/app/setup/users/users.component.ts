import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { User } from 'app/types';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Apollo } from 'apollo-angular';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GET_USERS, REVOKE_USER, DELETE_USER, UPDATE_USER, ADD_USER } from 'app/services/users.graphql';
import { map } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: User[];
  user: User;
  
  displayedColumns: string[] = ['name', 'email', 'isAdmin', 'status', 'edit', 'changeStatus'];
  dataSource: MatTableDataSource<User>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private apollo: Apollo,
    public dialog: MatDialog) { 
      this.dataSource = new MatTableDataSource(this.users);
    }

  ngOnInit() {
    this.apollo.watchQuery({
      query: GET_USERS
    })
    .valueChanges.pipe(map((result: any) => result.data.getUsers))
    .subscribe(data => {
      this.users = data;
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  edit(user: User) {
    const dialogRef = this.dialog.open(CRUDUsers, {
      width: '300px',
      data: user
    });
  }

  revoke(user: User) {
    this.apollo.mutate({
      mutation: REVOKE_USER,
      variables: {
        id: user.id
      }
    })
    .subscribe();
  }

  delete(user: User) {
    this.apollo.mutate({
      mutation: DELETE_USER,
      variables: {
        id: user.id
      }
    })
    .subscribe();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CRUDUsers, {
      width: '300px'
    });
  }

}

@Component({
  selector: 'crud-users',
  templateUrl: 'crud-users.html',
  styleUrls: ['./users.component.scss']
})
export class CRUDUsers implements OnInit{

  userForm: FormGroup;
  user: User;

  @ViewChild('uform', {static: true}) userFormDirective;

  constructor(
    public dialogRef: MatDialogRef<CRUDUsers>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private fb: FormBuilder,
    private apollo: Apollo) {}

  createForm() {
    this.userForm = this.fb.group({
      name: [this.data ? this.data.name : '', Validators.required],
      email: [this.data ? this.data.email : '', [Validators.required, Validators.email]],
      password: [this.data ? this.data.password : '', Validators.required],
      isAdmin: [this.data ? this.data.isAdmin : '', Validators.required]
    });
  }

  get name() { return this.userForm.get('name'); }
  get email() { return this.userForm.get('email'); }
  get password() { return this.userForm.get('password'); }
  get isAdmin() { return this.userForm.get('isAdmin'); }

  ngOnInit() {
    this.createForm();
  }

  save() {
    if (this.data) {
      this.apollo.mutate({
        mutation: UPDATE_USER,
        variables: {
          id: this.data.id,
          name: this.userForm.value.name,
          email: this.userForm.value.email,
          password: this.userForm.value.password,
          isAdmin: this.userForm.value.isAdmin
        },
        refetchQueries: ['getUsers']
      })
      .subscribe();
    } else {
      this.apollo.mutate({
        mutation: ADD_USER,
        variables: {
          name: this.userForm.value.name,
          email: this.userForm.value.email,
          password: this.userForm.value.password,
          isAdmin: this.userForm.value.isAdmin
        },
        refetchQueries: ['getUsers']
      })
      .subscribe();
    }
    this.userFormDirective.resetForm();
    this.dialogRef.close();
  }

}

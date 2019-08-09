import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Brand } from 'app/types';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Apollo } from 'apollo-angular';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GET_BRANDS, REVOKE_BRAND, DELETE_BRAND, UPDATE_BRAND, ADD_BRAND } from 'app/services/brands.graphql';
import { map } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent implements OnInit {

  brands: Brand[];
  brand: Brand;
  
  displayedColumns: string[] = ['name', 'status', 'edit', 'changeStatus'];
  dataSource: MatTableDataSource<Brand>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private apollo: Apollo,
    public dialog: MatDialog) { 
      this.dataSource = new MatTableDataSource(this.brands);
    }

  ngOnInit() {
    this.apollo.watchQuery({
      query: GET_BRANDS
    })
    .valueChanges.pipe(map((result: any) => result.data.getBrands))
    .subscribe(data => {
      this.brands = data;
      this.dataSource = new MatTableDataSource(this.brands);
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

  edit(brand: Brand) {
    const dialogRef = this.dialog.open(CRUDBrands, {
      width: '250px',
      data: brand
    });
  }

  revoke(brand: Brand) {
    this.apollo.mutate({
      mutation: REVOKE_BRAND,
      variables: {
        id: brand.id
      }
    })
    .subscribe();
  }

  delete(brand: Brand) {
    this.apollo.mutate({
      mutation: DELETE_BRAND,
      variables: {
        id: brand.id
      }
    })
    .subscribe();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CRUDBrands, {
      width: '250px'
    });
  }

}

@Component({
  selector: 'crud-brands',
  templateUrl: 'crud-brands.html',
})
export class CRUDBrands implements OnInit{

  brandForm: FormGroup;
  brand: Brand;

  @ViewChild('bform', {static: true}) brandFormDirective;

  constructor(
    public dialogRef: MatDialogRef<CRUDBrands>,
    @Inject(MAT_DIALOG_DATA) public data: Brand,
    private fb: FormBuilder,
    private apollo: Apollo) {}

  createForm() {
    this.brandForm = this.fb.group({
      name: [this.data ? this.data.name : '', Validators.required]
    });
  }

  get name() { return this.brandForm.get('name'); }

  ngOnInit() {
    this.createForm();
  }

  save() {
    if (this.data) {
      this.apollo.mutate({
        mutation: UPDATE_BRAND,
        variables: {
          id: this.data.id,
          name: this.brandForm.value.name
        },
        refetchQueries: ['getBrands']
      })
      .subscribe();
    } else {
      this.apollo.mutate({
        mutation: ADD_BRAND,
        variables: {
          name: this.brandForm.value.name
        },
        refetchQueries: ['getBrands']
      })
      .subscribe();
    }
    this.brandFormDirective.resetForm();
    this.dialogRef.close();
  }

}

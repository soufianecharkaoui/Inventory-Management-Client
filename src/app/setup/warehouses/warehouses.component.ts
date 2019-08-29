import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Warehouse, Currency } from 'app/types';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Apollo } from 'apollo-angular';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GET_WAREHOUSES, REVOKE_WAREHOUSE, DELETE_WAREHOUSE, UPDATE_WAREHOUSE, ADD_WAREHOUSE } from 'app/services/warehouses.graphql';
import { map } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GET_CURRENCIES } from 'app/services/currencies.graphql';

@Component({
  selector: 'app-warehouses',
  templateUrl: './warehouses.component.html',
  styleUrls: ['./warehouses.component.scss']
})
export class WarehousesComponent implements OnInit {

  warehouses: Warehouse[];
  warehouse: Warehouse;
  
  displayedColumns: string[] = ['name', 'currency', 'address', 'phone', 'email', 'status', 'edit', 'changeStatus'];
  dataSource: MatTableDataSource<Warehouse>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private apollo: Apollo,
    public dialog: MatDialog) { 
      this.dataSource = new MatTableDataSource(this.warehouses);
    }

  ngOnInit() {
    this.apollo.watchQuery({
      query: GET_WAREHOUSES
    })
    .valueChanges.pipe(map((result: any) => result.data.getWarehouses))
    .subscribe(data => {
      this.warehouses = data;
      this.dataSource = new MatTableDataSource(this.warehouses);
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

  edit(warehouse: Warehouse) {
    const dialogRef = this.dialog.open(CRUDWarehouses, {
      width: '300px',
      data: warehouse
    });
  }

  revoke(warehouse: Warehouse) {
    this.apollo.mutate({
      mutation: REVOKE_WAREHOUSE,
      variables: {
        id: warehouse.id
      }
    })
    .subscribe();
  }

  delete(warehouse: Warehouse) {
    this.apollo.mutate({
      mutation: DELETE_WAREHOUSE,
      variables: {
        id: warehouse.id
      }
    })
    .subscribe();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CRUDWarehouses, {
      width: '300px'
    });
  }

}

@Component({
  selector: 'crud-warehouses',
  templateUrl: 'crud-warehouses.html',
  styleUrls: ['./warehouses.component.scss']
})
export class CRUDWarehouses implements OnInit{

  warehouseForm: FormGroup;
  warehouse: Warehouse;
  currencies: Currency[];

  @ViewChild('wform', {static: true}) warehouseFormDirective;

  constructor(
    public dialogRef: MatDialogRef<CRUDWarehouses>,
    @Inject(MAT_DIALOG_DATA) public data: Warehouse,
    private fb: FormBuilder,
    private apollo: Apollo) {}

  createForm() {
    this.warehouseForm = this.fb.group({
      name: [this.data ? this.data.name : '', Validators.required],
      city: [this.data ? this.data.city : '', Validators.required],
      country: [this.data ? this.data.country : '', Validators.required],
      currencyId: [this.data ? this.data.currency.id : '', Validators.required],
      address: [this.data ? this.data.address : '', Validators.required],
      phone: [this.data ? this.data.phone : '', Validators.required],
      email: [this.data ? this.data.email : '', [Validators.required, Validators.email]]
    });
  }

  get name() { return this.warehouseForm.get('name'); }
  get city() { return this.warehouseForm.get('city'); }
  get country() { return this.warehouseForm.get('country'); }
  get currencyId() { return this.warehouseForm.get('currencyId'); }
  get address() { return this.warehouseForm.get('address'); }
  get phone() { return this.warehouseForm.get('phone'); }
  get email() { return this.warehouseForm.get('email'); }

  ngOnInit() {
    this.createForm();

    this.apollo.watchQuery({
      query: GET_CURRENCIES
    })
    .valueChanges.pipe(map((result: any) => result.data.getCurrencies))
    .subscribe(data => this.currencies = data);
  }

  save() {
    if (this.data) {
      this.apollo.mutate({
        mutation: UPDATE_WAREHOUSE,
        variables: {
          id: this.data.id,
          name: this.warehouseForm.value.name,
          city: this.warehouseForm.value.city,
          country: this.warehouseForm.value.country,
          currencyId: this.warehouseForm.value.currencyId,
          address: this.warehouseForm.value.address,
          phone: this.warehouseForm.value.phone,
          email: this.warehouseForm.value.email
        },
        refetchQueries: ['getWarehouses']
      })
      .subscribe();
    } else {
      this.apollo.mutate({
        mutation: ADD_WAREHOUSE,
        variables: {
          name: this.warehouseForm.value.name,
          city: this.warehouseForm.value.city,
          country: this.warehouseForm.value.country,
          currencyId: this.warehouseForm.value.currencyId,
          address: this.warehouseForm.value.address,
          phone: this.warehouseForm.value.phone,
          email: this.warehouseForm.value.email
        },
        refetchQueries: ['getWarehouses']
      })
      .subscribe();
    }
    this.warehouseFormDirective.resetForm();
    this.dialogRef.close();
  }

}

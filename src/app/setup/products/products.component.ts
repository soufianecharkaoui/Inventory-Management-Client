import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Product, ProductCategory, Warehouse, Transaction } from 'app/types';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Apollo } from 'apollo-angular';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GET_PRODUCTS, REVOKE_PRODUCT, DELETE_PRODUCT, UPDATE_PRODUCT, ADD_PRODUCT, REFRESH_PRODUCT, REFRESH_PRODUCTS } from 'app/services/products.graphql';
import { map } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { GET_PRODUCT_CATEGORIES, GET_PRODUCT_CATEGORY } from 'app/services/product-categories.graphql';
import { GET_WAREHOUSES, GET_WAREHOUSE } from 'app/services/warehouses.graphql';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  products: Product[];
  product: Product;
  transactions: Transaction[];
  
  displayedColumns: string[] = ['code', 'name', 'warehouse', 'unit', 'stockQuantity', 'status', 'edit', 'changeStatus', 'refresh'];
  dataSource: MatTableDataSource<Product>;
  
  codeFilter = new FormControl();
  productFilter = new FormControl();
  warehouseFilter = new FormControl();

  filteredValues =
  {
    code: '',
    product: '',
    warehouse: ''
  };

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private apollo: Apollo,
    public dialog: MatDialog) { 
      this.dataSource = new MatTableDataSource(this.products);
      this.dataSource.filterPredicate = this.customFilterPredicate();
    }

  ngOnInit() {
    this.apollo.watchQuery({
      query: GET_PRODUCTS
    })
    .valueChanges.pipe(map((result: any) => result.data.getProducts))
    .subscribe(data => {
      this.products = data;
      this.dataSource = new MatTableDataSource(this.products);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.codeFilter.valueChanges.subscribe((codeFilterValue) => {
        this.filteredValues['code'] = codeFilterValue;
        this.dataSource.filter = JSON.stringify(this.filteredValues);
      });

      this.productFilter.valueChanges.subscribe((productFilterValue) => {
        this.filteredValues['product'] = productFilterValue;
        this.dataSource.filter = JSON.stringify(this.filteredValues);
      });

      this.warehouseFilter.valueChanges.subscribe((warehouseFilterValue) => {
        this.filteredValues['warehouse'] = warehouseFilterValue;
        this.dataSource.filter = JSON.stringify(this.filteredValues);
      });

      this.dataSource.filterPredicate = this.customFilterPredicate();
    });

    this.apollo.mutate({
      mutation: REFRESH_PRODUCTS, 
      refetchQueries: ['getProducts']
    })
    .subscribe();
  }

  customFilterPredicate()
  {
    const myFilterPredicate = function(data: Product, filter: string): boolean
    {
      let searchString = JSON.parse(filter);

      return data.code.toString().trim().indexOf(searchString.code) !== -1
        && (data.productCategory.name.toString().trim().indexOf(searchString.product) !== -1 || data.brand.name.toString().trim().indexOf(searchString.product) !== -1 || data.specs.toString().trim().indexOf(searchString.product) !== -1)
        && data.warehouse.name.toString().trim().indexOf(searchString.warehouse) !== -1
    }

    return myFilterPredicate;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  edit(product: Product) {
    const dialogRef = this.dialog.open(CRUDProducts, {
      width: '300px',
      data: product
    });
  }

  revoke(product: Product) {
    this.apollo.mutate({
      mutation: REVOKE_PRODUCT,
      variables: {
        id: product.id
      }
    })
    .subscribe();
  }

  delete(product: Product) {
    this.apollo.mutate({
      mutation: DELETE_PRODUCT,
      variables: {
        id: product.id
      }
    })
    .subscribe();
  }

  refresh(product: Product) {
    this.apollo.mutate({
      mutation: REFRESH_PRODUCT,
      variables: {
        id: product.id,
      },
    })
    .subscribe();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CRUDProducts, {
      width: '300px'
    });
  }

}

@Component({
  selector: 'crud-products',
  templateUrl: 'crud-products.html',
  styleUrls: ['./products.component.scss']
})
export class CRUDProducts implements OnInit{

  productForm: FormGroup;
  product: Product;
  productCategories: ProductCategory[];
  productCategory: ProductCategory;
  warehouses: Warehouse[];
  warehouse: Warehouse;
  products: Product[];
  
  @ViewChild('pform', {static: true}) productFormDirective;

  constructor(
    public dialogRef: MatDialogRef<CRUDProducts>,
    @Inject(MAT_DIALOG_DATA) public data: Product,
    private fb: FormBuilder,
    private apollo: Apollo) {}

  createForm() {
    this.productForm = this.fb.group({
      productCategoryId: [this.data ? this.data.productCategory.id : '', Validators.required],
      brandId: [this.data ? this.data.brand.id : '', Validators.required],
      specs: [this.data ? this.data.specs : '', Validators.required],
      warehouseId: [this.data ? this.data.warehouse.id : '', Validators.required],
      unit: [this.data ? this.data.unit : '', Validators.required],
    });
  }

  get productCategoryId() { return this.productForm.get('productCategoryId'); }
  get brandId() { return this.productForm.get('brandId'); }
  get specs() { return this.productForm.get('specs'); }
  get warehouseId() { return this.productForm.get('warehouseId'); }
  get unit() { return this.productForm.get('unit'); }

  ngOnInit() {
    this.createForm();

    this.apollo.watchQuery({
      query: GET_PRODUCTS
    })
    .valueChanges.pipe(map((result: any) => result.data.getProducts))
    .subscribe(data => this.products = data);

    this.apollo.watchQuery({
      query: GET_PRODUCT_CATEGORIES
    })
    .valueChanges.pipe(map((result: any) => result.data.getProductCategories))
    .subscribe(data => this.productCategories = data);

    this.apollo.watchQuery({
      query: GET_WAREHOUSES
    })
    .valueChanges.pipe(map((result: any) => result.data.getWarehouses))
    .subscribe(data => this.warehouses = data);
  }

  selectWarehouse(warehouseId: String) {
    this.apollo.watchQuery({
      query: GET_WAREHOUSE,
      variables: {
        id: warehouseId
      }
    })
    .valueChanges.pipe(map((result: any) => result.data.getWarehouse))
    .subscribe(data => this.warehouse = data);
  }

  selectProductCategory(productCategoryId: String) {
    this.apollo.watchQuery({
      query: GET_PRODUCT_CATEGORY,
      variables: {
        id: productCategoryId
      }
    })
    .valueChanges.pipe(map((result: any) => result.data.getProductCategory))
    .subscribe(data => this.productCategory = data);
  }

  save() {
    if (this.data) {
      this.apollo.mutate({
        mutation: UPDATE_PRODUCT,
        variables: {
          id: this.data.id,
          productCategoryId: this.productForm.value.productCategoryId,
          brandId: this.productForm.value.brandId,
          warehouseId: this.productForm.value.warehouseId,
          specs: this.productForm.value.specs,
          unit: this.productForm.value.unit,
          stockQuantity: this.data.stockQuantity
        },
        refetchQueries: ['getProducts']
      })
      .subscribe();
    } else {
      let warehouse_inits = this.warehouse.name.split('', 2);
      let city_inits = this.warehouse.city.split('', 2);
      let country_inits = this.warehouse.country.split('', 2);

      let code = 'P' + (country_inits[0] + country_inits[1] + city_inits[0] + city_inits[1] + warehouse_inits[0] + warehouse_inits[1] + (this.products.length + 1).toLocaleString('en-US', {minimumIntegerDigits: 6, useGrouping:false})).toUpperCase();

      this.apollo.mutate({
        mutation: ADD_PRODUCT,
        variables: {
          productCategoryId: this.productForm.value.productCategoryId,
          brandId: this.productForm.value.brandId,
          specs: this.productForm.value.specs,
          warehouseId: this.productForm.value.warehouseId,
          stockQuantity: 0,
          unit: this.productForm.value.unit,
          code: code
        },
        refetchQueries: ['getProducts']
      })
      .subscribe();
    }
    this.productFormDirective.resetForm();
    this.dialogRef.close();
  }
}

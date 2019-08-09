import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ProductCategory, Brand } from 'app/types';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Apollo } from 'apollo-angular';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GET_PRODUCT_CATEGORIES, REVOKE_PRODUCT_CATEGORY, DELETE_PRODUCT_CATEGORY, UPDATE_PRODUCT_CATEGORY, ADD_PRODUCT_CATEGORY } from 'app/services/product-categories.graphql';
import { map } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GET_BRANDS } from 'app/services/brands.graphql';

@Component({
  selector: 'app-product-categories',
  templateUrl: './product-categories.component.html',
  styleUrls: ['./product-categories.component.scss']
})
export class ProductCategoriesComponent implements OnInit {

  productCategories: ProductCategory[];
  productCategory: ProductCategory;
  
  displayedColumns: string[] = ['name', 'brands', 'status', 'edit', 'changeStatus'];
  dataSource: MatTableDataSource<ProductCategory>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private apollo: Apollo,
    public dialog: MatDialog) { 
      this.dataSource = new MatTableDataSource(this.productCategories);
    }

  ngOnInit() {
    this.apollo.watchQuery({
      query: GET_PRODUCT_CATEGORIES
    })
    .valueChanges.pipe(map((result: any) => result.data.getProductCategories))
    .subscribe(data => {
      this.productCategories = data;
      this.dataSource = new MatTableDataSource(this.productCategories);
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

  edit(productCategory: ProductCategory) {
    const dialogRef = this.dialog.open(CRUDProductCategories, {
      width: '250px',
      data: productCategory
    });
  }

  revoke(productCategory: ProductCategory) {
    this.apollo.mutate({
      mutation: REVOKE_PRODUCT_CATEGORY,
      variables: {
        id: productCategory.id
      }
    })
    .subscribe();
  }

  delete(productCategory: ProductCategory) {
    this.apollo.mutate({
      mutation: DELETE_PRODUCT_CATEGORY,
      variables: {
        id: productCategory.id
      }
    })
    .subscribe();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CRUDProductCategories, {
      width: '250px'
    });
  }

}

@Component({
  selector: 'crud-product-categories',
  templateUrl: 'crud-product-categories.html',
})
export class CRUDProductCategories implements OnInit{

  productCategoryForm: FormGroup;
  productCategory: ProductCategory;
  brands: Brand[];

  @ViewChild('pcform', {static: true}) productCategoryFormDirective;

  constructor(
    public dialogRef: MatDialogRef<CRUDProductCategories>,
    @Inject(MAT_DIALOG_DATA) public data: ProductCategory,
    private fb: FormBuilder,
    private apollo: Apollo) {}

  createForm() {
    this.productCategoryForm = this.fb.group({
      name: [this.data ? this.data.name : '', Validators.required],
      brandIds: [this.data ? this.data.brands.map(brand => {return brand.id;}) : '', Validators.required]
    });
  }

  get name() { return this.productCategoryForm.get('name'); }
  get brandIds() { return this.productCategoryForm.get('brandIds'); }

  ngOnInit() {
    this.createForm();

    this.apollo.watchQuery({
      query: GET_BRANDS
    })
    .valueChanges.pipe(map((result: any) => result.data.getBrands))
    .subscribe(data => this.brands = data);
  }

  save() {
    console.log(this.productCategoryForm.value.brandIds);
    if (this.data) {
      this.apollo.mutate({
        mutation: UPDATE_PRODUCT_CATEGORY,
        variables: {
          id: this.data.id,
          name: this.productCategoryForm.value.name,
          brandIds: this.productCategoryForm.value.brandIds
        },
        refetchQueries: ['getProductCategories']
      })
      .subscribe();
    } else {
      this.apollo.mutate({
        mutation: ADD_PRODUCT_CATEGORY,
        variables: {
          name: this.productCategoryForm.value.name,
          brandIds: this.productCategoryForm.value.brandIds
        },
        refetchQueries: ['getProductCategories']
      })
      .subscribe();
    }
    this.productCategoryFormDirective.resetForm();
    this.dialogRef.close();
  }

}

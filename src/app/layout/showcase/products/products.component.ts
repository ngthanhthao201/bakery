import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { ApiService } from '../../../shared/services/api.service';
import { ProductCategory } from '../../../shared/models/product-category.model';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Product } from '../../../shared/models/product.model';
import { SnotifyService } from 'ng-snotify';

import { ProductSample } from '../../../shared/models/product-sample.model';
import { Shop } from '../../../shared/models/shop.model';
import * as _ from 'lodash';
import { Utilities } from '../../../shared/services/utilities';
import { CakeSizeType } from '../../../shared/models/cake-size-type.model';
import { NewEditProductDialogComponent } from './new-edit-product-dialog/new-edit-product-dialog.component';
import { PreviewDialogComponent } from '../preview-dialog/preview-dialog.component';
import { TourService } from '../../../shared/services/tour.service';
import { NewSeriesProductDialogComponent } from './new-series-product-dialog/new-series-product-dialog.component';

declare var $ :any;


@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss'],
    animations: [routerTransition()],
})
export class ProductsComponent implements OnInit {
    parentsLink = [{name:'Tủ bánh', link: 'showcase'}];
    currentShop :Shop;
    products: any[];
    productCategory: ProductCategory;
    productCategoryId: number;
    currencyMaskOptions ={prefix: '' , suffix: 'đ ', thousands: '.', precision:0 };
    newImageFile: any;
    uploadingImage= false;
    dataSource=[];
    cakeSizeTypes :CakeSizeType[];
    files = [];
    url : any;
    imageurl = [];
    isLoading = false;
    image: any;
    currentFile: any;
    loadingMessage = '';
    currentProduct: Product;

    constructor(private tourService: TourService, public dialog: MatDialog, private apiService: ApiService, private route: ActivatedRoute, private snotifyService: SnotifyService
        ) {}

  
    applyFilter(filterValue: string) {
      filterValue = filterValue.trim(); // Remove whitespace
      filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
      
    }

    ngOnInit() {


       this.currentShop =  JSON.parse(localStorage.getItem('currentShop'));
       this.route.params.subscribe(params => {
            this.productCategoryId = params['id']; 
            this.getProducts();
            this.getProductCategory();

            this.getTypes();
        });
    }

    ngAfterViewInit() {   
        this.tourService.startTour("productsComponent");
    }
    
    getTypes(){
        this.apiService.getCakeSizeTypes(this.currentShop.id).subscribe(r=>{
          this.cakeSizeTypes = r;
        });
      }

    // initNewSampleProduct(p: any){
    //     p.newProductSample ={};
    //     p.newProductSample.productId = p.id;
    //     p.newProductSample.extraAmount = 0;
    //     p.newProductSample.image="https://mybakerystorage.blob.core.windows.net/thumbs/placeholder.jpg";
    //     p.newProductSample.isActive  = true;
    //     p.newProductSample.name = "";
    //     p.newProductSample.idNumber = Utilities.getFirstLetterOfEachWord(p.name) + "-" + (p.productSamples.length +1);
    // }

    getProductCategory(){
        this.apiService.getProductCategoryById(this.productCategoryId).subscribe(r=>{
            this.productCategory = r;
            //this.parentsLink[0].name = r.name;
        });
    }

    getProducts(): void{
        this.apiService.getProductsByCategoryId(this.productCategoryId).subscribe(res=>{   
            console.log(res);        
  
            this.products = res;
            this.route.queryParams.subscribe(queryParams => {
                var focusIdNumber = queryParams['focus']; 
                if(focusIdNumber){
                window.setTimeout(()=>{
                    var ele = $('#'+'product-' + focusIdNumber)

                    var offset = ele.offset();
                    offset.left -= 20;
                    offset.top -= 20;
                    ele.addClass('focused');
                    $('html, body').animate({
                        scrollTop: offset.top,
                        scrollLeft: offset.left
                    });
                   
                }, 500);
            }
                
            });
        }
        );
    }

    updateProduct(product: Product){

            let dialogRef = this.dialog.open(NewEditProductDialogComponent, {
                width: '600px',
                data:  {      
                    currentProduct: product,
                    cakeSizeTypes: this.cakeSizeTypes,
                }
              });

              dialogRef.afterClosed().subscribe(r=>{
                  this.getProducts();
              })
    }

    toggleActiveProduct(productId: number){
        this.apiService.toggleActiveProduct(productId).subscribe(r=>{
            this.snotifyService.success("Cập nhật sản phẩm thành công!","");
            this.getProducts();
        })
    }

    deleteProduct(productId: number){
        this.snotifyService.confirm("Bạn có chắc chắn muốn xóa sản phẩm này (sẽ xóa luôn các mẫu)?","",{
            buttons:[
                {
                    text:"Ok",
                    action: ()=>{
                        this.apiService.deleteProduct(productId).subscribe(r=>{
                            this.getProducts();
                        })
                        this.snotifyService.clear();
                    }
                },{
                    text: "Cancel",
                    action:()=>{
                         this.snotifyService.clear();
                    }
                }
            ]
          });   
    }

    createNewProduct(){
        var newProduct = new Product();
            newProduct.productCategoryId = this.productCategoryId;
            newProduct.idNumber = Utilities.getFirstLetterOfEachWord(this.productCategory.name) + "-" + (this.products.length +1);
            let dialogRef = this.dialog.open(NewEditProductDialogComponent, {
                width: '600px',
                data:  {      
                    currentProduct: newProduct,
                    cakeSizeTypes: this.cakeSizeTypes,
                }
              });

              dialogRef.afterClosed().subscribe(r=>{
                  this.getProducts();
              })
        // this.apiService.createProduct(product).subscribe(r=>{
            
        // })
    }
    createSeriesProduct(){
        var newProduct = new Product();
            newProduct.productCategoryId = this.productCategoryId;
            newProduct.idNumber = Utilities.getFirstLetterOfEachWord(this.productCategory.name) + "-" + (this.products.length +1);
        let dialogRef = this.dialog.open(NewSeriesProductDialogComponent, {
            width: '70%',
            height: '80%',
            data:  {      
                currentProduct: newProduct,
                cakeSizeTypes: this.cakeSizeTypes,
                productCategory: this.productCategory,
            }
          });
          dialogRef.afterClosed().subscribe(r=>{
              this.files = r;
              this.getProducts();
        })
    }
    onSubmit() {
        for (const file of this.files) {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
            this.url = reader.result; 
            var newLength = this.imageurl.push(this.url);
          }
          
        }
        this.createImagesProduct();
        // const formData = new FormData();
        //   formData.append('file', this.fileData);
        //   this.http.post('url/to/your/api', formData)
        //     .subscribe(res => {
        //       console.log(res);
        //       this.uploadedFilePath = res.data.filePath;
        //       alert('SUCCESS !!');
        //     })
    }
    createImagesProduct() {
        this.isLoading = true;
        if(this.image){
          this.loadingMessage = 'Đang tải ảnh lên ...'
          this.apiService.uploadImageAzure(this.currentFile ,this.image, this.currentShop.shopCode + "-Product").subscribe(r => {
            if (r) {
              this.currentProduct.image = r;
              this.saveProduct();
            }
          })
        }else{
          this.saveProduct();
        }   
      }
      isCreatingNew() {
        return !this.currentProduct.id;
      }
      saveProduct(){
        this.loadingMessage = 'Đang lưu bánh ...'
        if(this.isCreatingNew()){
          this.currentProduct.isActive = true;
          this.apiService.createProduct(this.currentProduct).subscribe(r=>{
            this.snotifyService.success("Tạo mới thành công","");
            this.isLoading = false;
          });
        }
      }
    getFiles(event){ 
        this.newImageFile = event.target.files[0]; 
        
    } 

    updateProductSample(productSample){
        this.apiService.updateProductSample(productSample).subscribe(r=>{
            this.snotifyService.success("Update Successfully!", "");
        })
    }

    previewOnPhone(){
        let dialogRef = this.dialog.open(PreviewDialogComponent, {
            data:  {
                products: this.products
            },
            panelClass:"hidden-container"
          });
    }

    deleteProductSample(p, productSampleId){
        this.apiService.deleteProductSample(productSampleId).subscribe(r=>{
            this.snotifyService.success("Delete Successfully!", "");
            p.selectedProductSample = undefined;
            _.remove(p.productSamples, {id: productSampleId});
        })
    }

    changeImage(p: Product){
        
    }

    uploadSample(product: any){
        product.newProductSample.productId = product.id;
        this.uploadingImage = true;
        if(this.newImageFile){
        var myReader:FileReader = new FileReader();
            myReader.onloadend = (e) => {
            var image = myReader.result;
            this.apiService.uploadImageAzure(this.newImageFile, image, this.currentShop.shopCode + "-PS").subscribe(r=>{
            
                if(r){
                    
                    product.newProductSample.image = r;
                
                    this.apiService.createProductSample(product.newProductSample).subscribe(r2=>{
                        this.uploadingImage = false;
                        product.productSamples.push(r2);
                        
                    })
                    
                }
            })
            }
            myReader.readAsDataURL(this.newImageFile);
        }else{
            this.apiService.createProductSample(product.newProductSample).subscribe(r2=>{
                this.uploadingImage = false;
                product.productSamples.push(r2);
               
            })
        }
    }
}

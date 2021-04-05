import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../../../shared/services/api.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Shop } from '../../../../shared/models/shop.model';
import { SnotifyService } from 'ng-snotify';
import { DeliveryOption } from '../../../../shared/models/delivery-option.model';
import { WebsiteConfig } from '../../../../shared/models/website-config.model';
import { FacebookPost } from '../../../../shared/models/facebook-post.model';
import { ShopService } from '../../../../shared/services/shop.service';
import { ProductCategory } from '../../../../shared/models/product-category.model';
import * as _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { FacebookPostService } from '../../services/facebook.service';
import { FileUploader } from 'ng2-file-upload';

const URL = 'path_to_api';

@Component({
  selector: 'facebook-post',
  templateUrl: './facebook-post.component.html',
  styleUrls: ['./facebook-post.component.scss'],

})

export class FacebookPostComponent implements OnInit {

  imageFieldNames = ['image1', 'image2', 'image3', 'image4', 'image5', 'image6', 'image7', 'image8',
    'image9', 'image10', 'image11', 'image12'];
  savedImages: Array<any> ;
  categories: ProductCategory[];
  facebookPost: FacebookPost = new FacebookPost();
  currentShop: Shop;
  currencyMaskOptions = { prefix: '', suffix: 'đ ', thousands: '.', precision: 0 };
  image: any;
  currentFile: any;
  fbpId;
  facebookPageId;

  currentImageIndex = 1;
  seasons = [];

  videoFieldNames = ['video1', 'video2'];
  savedVideos: Array<any> ;
  // videoURL = '';

  public hasBaseDropZoneOver:boolean = false;
  public uploader:FileUploader = new FileUploader({url: URL});
  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

  constructor( private snotifyService: SnotifyService,
    private facebookService: FacebookPostService,
    private apiService: ApiService,
    private shopService: ShopService,
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,

    ) {
      this.facebookPageId = activatedRoute.snapshot.params.fbId;
      this.facebookPost.facebookPageShopId = this.facebookPageId;
      this.fbpId = activatedRoute.snapshot.params.fbpId;
  }

  ngOnInit() {
    this.getSeasons();
    this.getFacebookPost();

    this.uploader.onAfterAddingFile = (file) => {
      console.log('***** onAfterAddingFile ******')
      console.log('file ', file)
    }

    this.uploader.onCompleteItem =  (item:any, response:any, status:any, headers:any) => {
      console.log('ImageUpload:uploaded:', item, status, response);
    };

    this.uploader.onCompleteAll = () => {
      console.log('******* onCompleteAll *********')
    }

    this.uploader.onWhenAddingFileFailed = (item: any, filter: any, options: any) => {
      console.log('***** onWhenAddingFileFailed ********')
    }
  }

  getSeasons() {
    this.facebookService.getSeasons().subscribe(r => {
      this.seasons = r;
    })
  }

  getFacebookPost(){
    if(this.fbpId){
      this.facebookService.getFacebookPost(this.fbpId).subscribe(r=>{
        this.facebookPost = r;
        this.savedImages = [];
        _.each(this.imageFieldNames, field=>{
          if(this.facebookPost[field]){
            this.savedImages.push({fileName:'',url: this.facebookPost[field]});
          }
        })

        this.savedVideos = [];
        _.each(this.videoFieldNames, field=>{
          if(this.facebookPost[field]){
            this.savedVideos.push({fileName:'',url: this.facebookPost[field]});
          }
        })

        console.log("savedImages",this.savedImages);
        console.log("savedVideos",this.savedVideos);
        this.changeDetectorRef.detectChanges();
      })
    }else{
      this.savedImages = [];
      this.savedVideos = [];
    }
  }


  onUploadFinished($event) {
    $event.pending = true;
    //upload to azure

    $('.img-ul-clear').hide();


    if ($('.img-ul-image').length > 11) {
      this.snotifyService.error("Số lượng hình không được lớn hơn 12!", "");
      return;
    }

    this.apiService.uploadImageAzure($event.file, $event.src, this.shopService.currentShop.shopCode).subscribe(r => {
      $event.pending = false;
      _.each(this.imageFieldNames, field => {
        if (!this.facebookPost[field]) {
          this.facebookPost[field] = r;
          return false;
        }
      })
      this.apiService.editFacebookPost(this.facebookPost).subscribe(r => {

      });

    })

  }

  onUploadStateChanged(state: boolean) {
    console.log(state);
  }

  onRemoved($event) {
    this.apiService.deleteImageAzure($event.src).subscribe(r => {
      _.each(this.imageFieldNames, field => {
        if (this.facebookPost[field] === $event.src) {
          this.facebookPost[field] = undefined;
        }
      })

      this.apiService.editFacebookPost(this.facebookPost).subscribe(r => {

      });

    });
  }

  ngAfterViewInit() {
    this.textarea();
  }

  private textarea() {
    var textarea = $('textarea').on('keydown focus', (e) => {
      var el = e.target;
      el.style.cssText = 'height:auto; padding:5px';
      el.style.cssText = 'height:' + el.scrollHeight + 'px';

      var cloneTextArea = $('#clone-textarea')[0];
      cloneTextArea.style.cssText = 'height:auto; padding:5px';
      cloneTextArea.style.cssText = 'height:' + el.scrollHeight + 'px';
    }

    );
  }

  getFiles(event) {
    var file = event.target.files[0];
    this.readThis(file);
  }
  readThis(file: any): void {
    var myReader: FileReader = new FileReader();
    this.currentFile = file;
    myReader.onloadend = (e) => {
      this.apiService.uploadImageImg(myReader.result).subscribe(r => {
        this.snotifyService.success("Cập nhật ảnh thành công", "");
        this.setImage(r.data.link)
      })
    }
    myReader.readAsDataURL(file);
  }

  setImage(imagePath) {
    this.facebookPost["image" + this.currentImageIndex.toString()] = imagePath;
  }


  creatingNew() {
    return !this.facebookPost || !this.facebookPost.id;
  }

  ok() {
    if (this.creatingNew()) {
      this.facebookPost.facebookPost_Seasons = _.map(this.facebookPost.seasonIds, i=>{
        return {
          seasonId: i
        }
      })
      this.apiService.creatFacebookPost(this.facebookPost).subscribe(r => {
        this.snotifyService.success("Thêm mới thành công!");
        this.router.navigateByUrl("/facebook");
      });
    } else {
      this.apiService.editFacebookPost(this.facebookPost).subscribe(r => {
        this.snotifyService.success("Sửa thành công!");
        // this.dialogRef.close(true);
      });
    }
  }

  selectionChange(e){
    console.log(e);
  }

  selectionChangeClicked(seasonId){

    if(this.creatingNew()){
      return;
    }


    if(this.facebookPost.seasonIds.indexOf(seasonId) > -1){
      //add
      this.facebookService.addPostSeason({facebookPostId: this.fbpId, seasonId: seasonId}).subscribe(r=>{

      })
    }else{
      //delete
      this.facebookService.deletePostSeason({facebookPostId: this.fbpId, seasonId: seasonId}).subscribe(r=>{
        
      })
    }

  }

  onUploadVideo($event) {
    $event.pending = true;
    //upload to azure

    this.apiService.uploadVideo($event.file, $event.src, this.shopService.currentShop.shopCode).subscribe(r => {
      $event.pending = false;
      _.each(this.videoFieldNames, field => {
        if (!this.facebookPost[field]) {
          
          this.facebookPost[field] = r;
          return false;
        }
      })
      this.apiService.editFacebookPost(this.facebookPost).subscribe(r => {
      });

    })

  }

}


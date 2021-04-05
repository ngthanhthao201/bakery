import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../services/api.service';
import Cropper from 'cropperjs';

@Component({
    selector: 'image-uploader-button',
    templateUrl: './image-uploader-button.component.html',
    styleUrls: ['./image-uploader-button.component.scss'],
})
export class ImageUploaderButtonComponent {
    @Input() id;
    @Input() type;
    @Output() croppedImageDone: EventEmitter<any> = new EventEmitter();
    currentShop: any;
    closeResult: string;
    imageInputFile: any={};
    imageChangedEvent: any = '';
    cropper: Cropper;

    constructor(private modalService: NgbModal,  private changeDetectorRef: ChangeDetectorRef) {

        this.imageInputFile = {};

        this.currentShop=  JSON.parse(localStorage.getItem('currentShop'));
     }

     ngOnInit() {
    }

    croppedImage: any = '';

    fileChangeEvent(event: any): void {
        var _this = this;
        this.imageInputFile = event; 
         var reader = new FileReader();
        reader.onload = function(){

            var dataURL = reader.result;
            const image = document.getElementById('image') as any;
            image.src = dataURL;

            if(_this.cropper){
                _this.cropper.destroy();
            }
            _this.cropper = new Cropper(image, {
            aspectRatio: 1,

            crop(event) {

            },
            });

            _this.changeDetectorRef.detectChanges();
        };
        var input = event.target;
        reader.readAsDataURL(input.files[0]);


    }

    
    imageCropped(image: string) {
        this.croppedImage = image;
    }
    imageLoaded() {
        // show cropper
    }
    loadImageFailed() {
        // show message
    }

    open(content) {
        var modalRef= this.modalService.open(content, {backdrop: 'static', windowClass: 'adjustwidth', size: 'lg'});
        modalRef.result.then((result) => {

            this.croppedImageDone.emit({
                dataUrl: this.cropper.getCroppedCanvas(
                    {                
                         maxWidth: 1024,
                        maxHeight: 1024,
                    }   
                ).toDataURL('image/png', 0.5),
                 file: this.imageInputFile,

                }
                 );
            //modalRef.close(this.croppedImage);
            
            
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }



    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return  `with: ${reason}`;
        }
    }
}

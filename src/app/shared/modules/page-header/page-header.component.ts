import { Component, OnInit, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Shop } from '../../models/shop.model';
import { ShopService } from '../../services/shop.service';

@Component({
    selector: 'app-page-header',
    templateUrl: './page-header.component.html',
    styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnInit {
    @Input() heading: string;
    @Input() icon: string;
    currentShop: Shop;
    @Input() parents: any;
    pushRightClass: string = 'push-right';
    constructor(public shopService: ShopService) {
        
    }

    ngOnInit() {}

    openMenu(){
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }
}

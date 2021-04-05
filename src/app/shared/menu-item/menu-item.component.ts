import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NavItem} from './nav-item';
import { Utilities } from '../services/utilities';
import { MatDialog } from '@angular/material/dialog';
import { FullScreenImage } from '../dialogs/full-screen-image/full-screen-image.component';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent implements OnInit {
  @Input() items: NavItem[];
  @ViewChild('childMenu',{static: true}) public childMenu;

  constructor(public router: Router, private dialog: MatDialog) {
  }

  ngOnInit() {
  }

  resizeImage(child){
    //child.image = Utilities.replaceImageLink(child.image, window.innerWidth, window.innerHeight);
    this.dialog.open(FullScreenImage, {
      panelClass: 'col-md-12',
      data: {
        product: child.data
      }
    })
  }
}

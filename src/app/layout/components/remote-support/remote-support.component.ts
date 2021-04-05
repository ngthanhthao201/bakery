import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {FormControl} from '@angular/forms';
import { TooltipPosition } from '@angular/material/tooltip';

@Component({
  selector: 'app-remote-support',
  templateUrl: './remote-support.component.html',
  styleUrls: ['./remote-support.component.scss']
})
export class RemoteSupportComponent implements OnInit {

  constructor(private router: Router, private dialog: MatDialog,) { }

  ngOnInit() {
  }
  
  openDownload() {
    window.open("https://chrome.google.com/webstore/detail/chrome-remote-desktop/gbchcmhmhahfdphkhkmpfmihenigjmpp", "_blank", "resizable=yes, scrollbars=yes, titlebar=yes, width=800, height=800, top=10, left=10");
  
  }

}

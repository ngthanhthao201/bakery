import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-progress-tracker',
  templateUrl: './progress-tracker.component.html',
  styleUrls: ['./progress-tracker.component.scss']
})
export class ProgressTrackerComponent implements OnInit {
  @Input() steps: any;

  constructor() {
   }

  ngOnInit() {
  }

}

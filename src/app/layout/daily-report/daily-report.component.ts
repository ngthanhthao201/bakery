import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-daily-report',
  templateUrl: './daily-report.component.html',
  styleUrls: ['./daily-report.component.scss']
})
export class DailyReportComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  getRouterClass(route){
    return this.router.url.indexOf(route) > -1 ? "badge-primary" : "";
  }

}

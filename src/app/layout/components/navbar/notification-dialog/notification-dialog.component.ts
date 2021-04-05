import { Component, OnInit, Inject } from '@angular/core';
import { SnotifyService } from 'ng-snotify';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationsService } from '../../../../shared/services/notifications.service';

@Component({
  selector: 'app-notification-dialog',
  templateUrl: './notification-dialog.component.html',
  styleUrls: ['./notification-dialog.component.scss']
})
export class NotificationDialogComponent implements OnInit {
  notification: any;
  notificationDetail: any;

  constructor(private notificationsService: NotificationsService, private snotifyService: SnotifyService, private dialog: MatDialog,
    public dialogRef: MatDialogRef<NotificationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.notification = data.notification;
  }

  ngOnInit() {
    this.getNotificationArticle(this.notification.id);
  }

  getNotificationArticle(notificationId) {
    this.notificationsService.getNotificationArticleById(notificationId).subscribe(r => {
      this.notificationDetail = r;
      document.getElementById("notificationDetail").children[0].innerHTML = r.content;
    })
  }

}

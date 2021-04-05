import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FacebookComponent } from './facebook.component';
import { FacebookPostComponent } from './components/facebook-post/facebook-post.component';

const routes: Routes = [{
  path: '', component: FacebookComponent
},
    {
        path: 'fbp/:fbId',
        component: FacebookPostComponent
    },
    {
        path: 'fbp/:fbId/:fbpId',
        component: FacebookPostComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacebookRoutingModule { }

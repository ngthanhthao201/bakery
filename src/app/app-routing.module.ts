import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddFacebookPageComponent } from './add-facebook-page/add-facebook-page.component';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared';
import { SharedModule } from './shared/modules/shared.module';

const routes: Routes = [
    { path: '', loadChildren: './layout/layout.module#LayoutModule', canActivate: [AuthGuard] },
    { path: 'login', loadChildren: './login/login.module#LoginModule' },
    { path: 'signup', loadChildren: './signup/signup.module#SignupModule' },
    { path: 'error', loadChildren: './server-error/server-error.module#ServerErrorModule' },
    { path: 'not-found', loadChildren: './not-found/not-found.module#NotFoundModule' },
     {path: 'add-facebook/:uniqueId', component: AddFacebookPageComponent},
    { path: '**', redirectTo: 'not-found' },

];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
        SharedModule,
    ],
    declarations: [AddFacebookPageComponent],
    exports: [RouterModule]
})
export class AppRoutingModule {}

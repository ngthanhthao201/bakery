import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { ZaloLoginResponseComponent } from './zalo-login-response/zalo-login-response.component';
import { ConfirmOrdersComponent } from './orders/components/confirm-orders/confirm-orders.component';
import { ChatType } from '../shared/models/chat-type.enum';
import { ZaloOaManagerComponent } from './settings/components/zalo-oa-manager/zalo-oa-manager.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard' },
            { path: 'dashboard',  loadChildren: './dashboard/dashboard.module#DashboardModule'},
            { path: 'orders', loadChildren: './orders/orders.module#OrdersModule'},
            { path: 'showcase', loadChildren: './showcase/showcase.module#ShowcaseModule' },
            { path: 'customers', loadChildren: './customers/customers.module#CustomersModule' },
            { path: 'product-barcode', loadChildren:'./product-barcode/product-barcode.module#ProductBarcodeModule' },
            { path: 'stuff-barcode', loadChildren:'./stuff-barcode/stuff-barcode.module#StuffBarcodeModule' },
            { path: 'financial', loadChildren: './financial/financial.module#FinancialModule'},
            { path: 'providers-warehouse', loadChildren: './providers-warehouse/providers-warehouse.module#ProvidersWarehouseModule' },
            { path: 'settings', loadChildren: './settings/settings.module#SettingsModule'},
            { path: 'facebook', loadChildren: './facebook/facebook.module#FacebookModule'},
            { path: 'zalo', component: ZaloOaManagerComponent},
            { path: 'zalo_login_response',component: ZaloLoginResponseComponent,  pathMatch: 'full'},
            { path: 'vouchers', loadChildren: './vouchers/vouchers.module#VouchersModule' },
            { path: 'profile', loadChildren: './profile/profile.module#ProfileModule' },
            { path: 'recharge', loadChildren: './recharge/recharge.module#RechargeModule' },
            { path: 'withdraw', loadChildren: './withdraw/withdraw.module#WithdrawModule' },
            { path: 'transaction-history', loadChildren: './transaction-history/transaction-history.module#TransactionHistoryModule' },
            { path: 'daily-report', loadChildren: './daily-report/daily-report.module#DailyReportModule'},
            { path: 'employees-report', loadChildren: './employees-report/employees-report.module#EmployeesReportModule'},
            { path: 'chats-facebook-messenger', loadChildren: './chats/chats.module#ChatsModule', data: {chatType: ChatType.Facebook}},
            { path: 'chats', loadChildren: './chats/chats.module#ChatsModule'},
            { path: 'input-product-barcode', loadChildren: './product-barcode/components/input-product-dialog/input-product-dialog.module#InputProductDialogModule'},
            { path: 'confirm-orders', component: ConfirmOrdersComponent,  pathMatch: 'full'},
            { path: 'input-product-barcode-handmade', loadChildren: './product-barcode/components/input-product-handmade/input-product-handmade.module#InputProductHandmadeModule'}
            // { path: 'customer-detail', component: CustomerDetailComponent}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}

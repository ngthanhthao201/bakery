import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyFormatPipe } from './currencyformat.pipe';
import { TimeAgoBarcodePipe } from './time-ago-barcode.pipe';
import { CapitalizeFirstPipe } from './capitalizefirst.pipe';
import { DynamicAttributeDirective } from '../directives/dynamic-attribute.directive';
import { DescriptionsPipe } from './descriptions.pipe';
import { KeysPipe } from './keys.pipe';
import { VndInputPipe } from './vndinput.pipe';
import { TimeAgoPipe } from './time-ago.pipe';
import { ArraySortPipe } from './array-sort.pipe';
import { OrderCommentsPrintPipe } from './order-comments-print.pipe';
import { OrderStatusTextPipe } from './order-status-text.pipe';
import { CakeStatusTextPipe } from './cake-status-text.pipe';
import { ToggleFullscreenDirective } from '../directives/toggle-fullscreen.directive';
import { InputWithNumpadDirective } from '../directives/input-with-numpad.directive';
import { ProductBarcodeCountPipe } from './productBarcodeCount.pipe';
import { OrderCommentsDynamicPrintPipe } from './order-comments-dynamic-print.pipe';
import { OrderActiveStepPipe } from './order-active-step.pipe';
import { OrderStatusIconPipe } from './order-status-icon.pipe';
import { InputWithAlphabetPadDirective } from '../directives/input-with-alphabetPad.directive';
import { VnPhonePipe } from './vnphone.pipe';
import { SafeStylePipe } from './safeStyle.pipe';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [ArraySortPipe, KeysPipe, CapitalizeFirstPipe, VndInputPipe,CurrencyFormatPipe,VnPhonePipe, TimeAgoBarcodePipe, OrderStatusTextPipe,
        CakeStatusTextPipe,ToggleFullscreenDirective,InputWithNumpadDirective, InputWithAlphabetPadDirective,
         TimeAgoPipe, DynamicAttributeDirective, DescriptionsPipe, OrderCommentsPrintPipe, OrderCommentsDynamicPrintPipe,
          ProductBarcodeCountPipe, OrderActiveStepPipe, OrderStatusIconPipe, SafeStylePipe],
    exports: [ArraySortPipe, KeysPipe, CapitalizeFirstPipe,VndInputPipe, CurrencyFormatPipe, VnPhonePipe,TimeAgoBarcodePipe, OrderStatusTextPipe,
        CakeStatusTextPipe,ToggleFullscreenDirective, InputWithNumpadDirective, InputWithAlphabetPadDirective,
         TimeAgoPipe, DynamicAttributeDirective, DescriptionsPipe, OrderCommentsPrintPipe, OrderCommentsDynamicPrintPipe,
         ProductBarcodeCountPipe, OrderActiveStepPipe, OrderStatusIconPipe, SafeStylePipe]
})
export class SharedPipesModule { }

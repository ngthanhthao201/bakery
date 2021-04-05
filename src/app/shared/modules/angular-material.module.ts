import { NgModule } from '@angular/core';

import {MatTabsModule} from '@angular/material/tabs';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTableModule} from '@angular/material/table'
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule, MatOption, MatRippleModule } from '@angular/material/core';
import { MatDialogModule, MatDialogTitle } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioButton, MatRadioGroup, MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MatInputModule } from '@angular/material/input';


@NgModule({
    imports: [ MatAutocompleteModule, MatStepperModule, MatMenuModule, MatChipsModule, MatCheckboxModule, MatDialogModule,
         MatCardModule,MatBottomSheetModule, MatGridListModule ,MatListModule,MatTabsModule,
          MatDatepickerModule, MatFormFieldModule, MatTableModule, MatInputModule, MatSlideToggleModule,
        MatPaginatorModule, MatToolbarModule, MatIconModule, MatButtonModule, MatDialogModule, 
         MatSelectModule, MatAutocompleteModule, MatRippleModule, MatTooltipModule, MatRadioModule, MatProgressSpinnerModule,
        MatExpansionModule, MatSliderModule],

    exports:[ MatAutocompleteModule, MatStepperModule, MatMenuModule, MatChipsModule, MatCheckboxModule, MatDialogModule,
        MatCardModule,MatBottomSheetModule, MatGridListModule ,MatListModule,MatTabsModule,
         MatDatepickerModule, MatFormFieldModule, MatTableModule, MatInputModule, MatSlideToggleModule,
       MatPaginatorModule, MatToolbarModule, MatIconModule, MatButtonModule, MatDialogModule,
        MatSelectModule, MatAutocompleteModule, MatRippleModule, MatTooltipModule, MatRadioModule, MatProgressSpinnerModule,
        MatExpansionModule, MatSliderModule],

})
export class AngularMaterialModule {}

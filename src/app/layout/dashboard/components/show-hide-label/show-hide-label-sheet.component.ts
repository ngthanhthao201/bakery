import { Component } from "@angular/core";
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from "@angular/material/bottom-sheet";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { ThemePalette } from "@angular/material/core";
import { Inject } from "@angular/core";
import { BarcodeService } from "../../../../shared/services/barcode.service";
import { ShopService } from "../../../../shared/services/shop.service";
import { SettingsService } from "../../../../shared/services/settings.service";

@Component({
    selector: "show-hide-label-sheet",
    templateUrl: "show-hide-label-sheet.component.html",
})
export class ShowHideLabelSheet {
    labels = {};
    color: ThemePalette = "accent";

    constructor(
        public barcodeService: BarcodeService,
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
        private bottomSheetRef: MatBottomSheetRef<ShowHideLabelSheet>,
        public shopService: ShopService,
        public settingsService: SettingsService
    ) {
        this.labels = Object.keys(barcodeService.labelsShowHideSettings);
    }

    openLink(event: MouseEvent): void {
        this.bottomSheetRef.dismiss();
        event.preventDefault();
    }

}

import { HotTableRegisterer } from "@handsontable/angular";
import Handsontable from "handsontable";
import arAR from '../constants/ar-AR';
import { registerLanguageDictionary } from "handsontable/i18n";

export class HandsontableSettings {
    handsontable_id!: string;
    hotRegisterer = new HotTableRegisterer();
    hotSettings!: Handsontable.GridSettings;
    hotInstance!: Handsontable;
    itemSource: any[] = [];
    rowHeader: any[] = [];
    language: string = 'ar-AR';

    constructor(_handsontable_id: string) {
        this.handsontable_id = _handsontable_id;


    }

    //intialize handsontable
    intializeHandsontable() {
        //intialize handsontable automatic.
        this.hotInstance = this.hotRegisterer.getInstance(this.handsontable_id);

        //register Language internationalization handling
        registerLanguageDictionary(arAR);
    }


}

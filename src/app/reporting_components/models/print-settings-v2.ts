import { ElementRef } from "@angular/core";

export enum PMODE {
    NORMAL,
    ADVANCED
};

export enum PORIENTATION {
    LANDSCAPE,
    PORTRAIT

};

export class PrintSettingsV2 {
    //properties @printing.
    printingSection:ElementRef|HTMLElement|Node|undefined = undefined;
    printingMode: PMODE = PMODE.NORMAL;
    printingOrientaion: PORIENTATION = PORIENTATION.LANDSCAPE;

    //properties @page.
    pageType: string = "A4";
    pageWidth: string = "297mm";
    pageHeight: string = "210mm";


    paperSizeOptions: any[] = [
        { label: 'A4 (210mm * 297mm)', value: { type: "A4", w: 210, h: 297 } },
        { label: 'A3 (297mm * 420mm)', value: { type: "A3", w: 297, h: 420 } },
        { label: 'A5 (148mm * 210mm)', value: { type: "A5", w: 148, h: 210 } },
    ];

}

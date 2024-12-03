export class PrintSettings {
    paperType: { type: string, w: number, h: number } = { type: "A4", w: 210, h: 297 };
    screenMode: string = "default";
    numberOfPages: number = 1;
    numberOfPagesArray: any[] = [];
    pageHeight: number = 0;

    paperSizeOptions: any[] = [
        { label: 'A3 (297mm * 420mm)', value: { type: "A3", w: 297, h: 420 } },
        { label: 'A4 (210mm * 297mm)', value: { type: "A4", w: 210, h: 297 } },
        { label: 'A5 (148mm * 210mm)', value: { type: "A5", w: 148, h: 210 } },
      ];
}

export class ExportSettings {
    selectExportType: string = "pdf";
    exportTypeOptions: any[] = [
        { label: 'استخراك ك (pdf)', value: "pdf" },
        { label: 'استخراك ك (excel)', value: "excel" },
        { label: 'استخراك ك (word)', value: "word" }
      ];

}

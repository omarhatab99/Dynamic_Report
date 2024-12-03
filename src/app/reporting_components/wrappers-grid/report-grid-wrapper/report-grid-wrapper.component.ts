import { AfterViewInit , Component , ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { GridHTMLElement, GridStack, GridStackOptions } from 'gridstack';
import { WidgetWrapperService } from '../../services/widget-wrapper.service';
import { TextAreaWidget } from '../../models/text-area-widget';
import { PrintingService } from '../../services/printing.service';
import { ExportWordService } from '../../services/export-word.service';
import { ExportExcelService } from '../../services/export-excel.service';
import moment from 'moment';
import { ReportProperties } from '../../models/report-properties';
import { PrintSettings } from '../../models/print-settings';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Helper } from '../../constants/helper';
import { ToastrService } from 'ngx-toastr';
import { FixedTableWidget } from '../../models/fixed-table-widget';
import { ImageWidget } from '../../models/image-widget';
import { TEXTTYPE } from '../textarea-grid-wrapper/textarea-grid-wrapper.component';
import { DomSanitizer } from '@angular/platform-browser';
import { ExportationComponent } from '../../wrappers-others/exportation/exportation.component';
moment.locale('ar');

@Component({
  selector: 'app-report-grid-wrapper',
  templateUrl: './report-grid-wrapper.component.html',
  styleUrls: ['./report-grid-wrapper.component.css']
})
export class ReportGridWrapperComponent implements OnInit, AfterViewInit {

  //viewchilds 
  //report loader container
  @ViewChild("reportLoader") reportLoader!: ElementRef;
  //printing section container
  @ViewChild("printingSection") printingSection!: ElementRef;
  //gridstacks elements
  @ViewChild("gridstack_content_element") gridstack_content_element!: ElementRef;

  //report elements parts
  @ViewChild("cardContentReport") cardContentReport!: ElementRef;
  @ViewChild("cardHeaderReport") cardHeaderReport!: ElementRef;
  @ViewChild("cardFooterReport") cardFooterReport!: ElementRef;

  //image preview 
  @ViewChild("imagePreview") imagePreview!: ElementRef;

  //exportation preview
  @ViewChild("exportationPreview") exportationPreview!: ExportationComponent;

  //configurations
  @Input() allowReportStyleEditing:boolean = true;
  @Input() allowAddText:boolean = true;
  @Input() allowAddImage:boolean = true;

  //template ref
  headerTemplate: TemplateRef<any>[] = [];

  //gridstacks
  static gridstack_content_element: GridHTMLElement;
  static gridstack_content: GridStack;
  // static gridstack_tables_element: GridHTMLElement;
  // static gridstack_tables: GridStack;

  //widgets array
  widgets_textarea_collection: TextAreaWidget[] = [];
  widgets_fixedtable_collection: FixedTableWidget[] = [];
  widgets_images_collection: ImageWidget[] = [];

  //fixedTable
  fixed_row: any[] = [];
  fixed_itemSource: any[] = [];

  //state 
  static defaultGridState: any[] = [];
  static landscapeGridState: any[] = [];
  static portraitGridState: any[] = [];


  //configuration of angular editor
  editorConfig!: AngularEditorConfig;

  //sidenav
  _displaySidebar: boolean = false;
  _displayExportation: boolean = false;

  //objects from report content
  reportSettings: ReportProperties = new ReportProperties();
  printSettings: PrintSettings = new PrintSettings();

  static sharedScreenMode: string = "default";

  //options 
  borderSizeOptions: any[] = [];

  //exportation
  exportTypeOptions: any[] = [];
  _selectExportType: string = "pdf";

  //printing
  paperSizeOptions: any[] = [];

  //watermark
  enableWaterMark: boolean = false;

  //varriables
  dateNow!: string;

  //textbox
  showDialogText: boolean = false;
  value: string = "";

  //image
  showDialogImage: boolean = false;
  imageUrl: string = "../../../assets/placeholder_image.png";
  imageUploaded: boolean = false;


  constructor(protected sanitizer: DomSanitizer , private _WidgetWrapperService: WidgetWrapperService, private _PrintingService: PrintingService , private _ExportWordService: ExportWordService, private _ExportExcelService: ExportExcelService, private _ToastrService: ToastrService) { }

  //properties
  //property for select screen mode
  get selectScreenMode() {
    return this.printSettings.screenMode;
  }

  set selectScreenMode(val: any) {
    //check if printing screen mode is default to handle current state of grid
    switch (this.printSettings.screenMode) {
      case "landscape":
        ReportGridWrapperComponent.landscapeGridState = this._WidgetWrapperService.getCurrentStateForItems(ReportGridWrapperComponent.gridstack_content);
        break;
      case "portrait":
        ReportGridWrapperComponent.portraitGridState = this._WidgetWrapperService.getCurrentStateForItems(ReportGridWrapperComponent.gridstack_content);
        break;
      default:
        ReportGridWrapperComponent.defaultGridState = this._WidgetWrapperService.getCurrentStateForItems(ReportGridWrapperComponent.gridstack_content);
        break;
    }

    //shared screenModeShared
    this.printSettings.screenMode = val;
    ReportGridWrapperComponent.sharedScreenMode = val;

    //handle paper options for method (handlePaperPrint)
    const mode = this.printSettings.screenMode; //has a default value in onInit
    const type = this.printSettings.paperType?.type;
    const width = this.printSettings.paperType?.w;
    const height = this.printSettings.paperType?.h;

    //handle paper print function
    this._PrintingService
      .handlePaperPrint(this.printingSection, type, mode, width, height);
    //handle print line
    this.printSettings.numberOfPages = this._PrintingService.handlePrintline(this.printingSection, type, mode).numberOfPages;
    this.printSettings.pageHeight = this._PrintingService.handlePrintline(this.printingSection, type, mode).pageHeight;
    this.printSettings.numberOfPagesArray = this._PrintingService.handlePrintline(this.printingSection, type, mode).numberOfPagesArray;

    //return current state of items
    setTimeout(() => {
      if (mode == "default" && ReportGridWrapperComponent.defaultGridState.length > 0) {
        //update privious state for items
        this._WidgetWrapperService.updateState(ReportGridWrapperComponent.gridstack_content, ReportGridWrapperComponent.defaultGridState);
      }

      if (mode == "landscape" && ReportGridWrapperComponent.landscapeGridState.length > 0) {
        //update privious state for items
        this._WidgetWrapperService.updateState(ReportGridWrapperComponent.gridstack_content, ReportGridWrapperComponent.landscapeGridState);
      }

      if (mode == "portrait" && ReportGridWrapperComponent.portraitGridState.length > 0) {
        //update privious state for items
        this._WidgetWrapperService.updateState(ReportGridWrapperComponent.gridstack_content, ReportGridWrapperComponent.portraitGridState);
      }
    }, 200);

  }


  //property for select export type
  get selectExportType() {
    return this._selectExportType;
  }

  set selectExportType(val: any) {
    this._selectExportType = val;
  }


  get selectPaperSize() {
    return this.printSettings.paperType;
  }

  set selectPaperSize(val: any) {
    //store value of paperType
    this.printSettings.paperType = val;

    //handle paper options for method (handlePaperPrint)
    const mode = this.printSettings.screenMode;
    const type = this.printSettings.paperType?.type;
    const width = this.printSettings.paperType?.w;
    const height = this.printSettings.paperType?.h;

    //handle paper print function
    this._PrintingService
      .handlePaperPrint(this.printingSection, type, mode, width, height);

    //handle print line
    this.printSettings.numberOfPages = this._PrintingService.handlePrintline(this.printingSection, type, mode).numberOfPages;
    this.printSettings.pageHeight = this._PrintingService.handlePrintline(this.printingSection, type, mode).pageHeight;
    this.printSettings.numberOfPagesArray = this._PrintingService.handlePrintline(this.printingSection, type, mode).numberOfPagesArray;

  }

  //component intialize
  ngOnInit(): void {
    //handle date to arabic
    this.dateNow = moment().format('llll'); // Get the formatted date

    //handle widgets service array
    this.widgets_textarea_collection = this._WidgetWrapperService.widgets_textarea_collection;
    this.widgets_fixedtable_collection = this._WidgetWrapperService.widgets_fixedtables_collection;
    this.widgets_images_collection = this._WidgetWrapperService.widgets_images_collection;
    //angular editor config
    this.editorConfig = Helper.editorConfig;

    //handle options function
    this.setupOptionsForCompoBoxAndMultiSelect();

  }

  //after view intialize
  ngAfterViewInit(): void {
    this.initializeAllGridstack();
  }


  initializeAllGridstack() {

    //start loader
    this.reportLoader.nativeElement.classList.remove("d-none");

    ReportGridWrapperComponent.gridstack_content_element = document.getElementById("gridstackContent") as GridHTMLElement;

    //intialize gridstack #1
    const grid_content_options: GridStackOptions = {
      handle: ".element-move-icon",
      float: true,
      resizable: { handles: "all" },
      rtl: true,
      cellHeight: "30px",
      sizeToContent: true,
      maxRow: 25
    }

    ReportGridWrapperComponent.gridstack_content =
      this._WidgetWrapperService.intializeGridstack(ReportGridWrapperComponent.gridstack_content_element, grid_content_options);

    setTimeout(() => {
      //end loader
      this.reportLoader.nativeElement.classList.add("d-none");
    }, 5000)
  }

  //this function used for send templateRef from component to another component.
  showHeaderTemplate(templateRef: TemplateRef<any>) {
    this.headerTemplate.push(templateRef);
  }


  //sidenav functions  
  displaySidebar() {
    this._displaySidebar = !this._displaySidebar;
  }


  //sidenav functions  
  displayExportation() {
    
    setTimeout(() => {
      this._displayExportation = !this._displayExportation;
      ExportationComponent.exportationStatic[0].calculatePageNumber();
    } , 100)

    setTimeout(() => {
      ExportationComponent.exportationStatic[0].handleExportaionContentPages();
    }, 500);


  }



  resetReportProperties() {
    this.reportSettings.padding = 10;
    this.reportSettings.border_color = "#000";
    this.reportSettings.border_size = "1";
    this.reportSettings.border_radius = 10;
  }

  //this function handle options of compo box and multiselect
  setupOptionsForCompoBoxAndMultiSelect() {

    //border size option of combo box
    this.borderSizeOptions = [
      { label: '1px', value: 1 },
      { label: '2px', value: 2 },
      { label: '3px', value: 3 },
      { label: '4px', value: 4 },
      { label: '5px', value: 5 },
    ];

    this.exportTypeOptions = [
      { label: 'استخراك ك (pdf)', value: "pdf" },
      { label: 'استخراك ك (excel)', value: "excel" },
      { label: 'استخراك ك (word)', value: "word" }
    ]

    this.paperSizeOptions = [
      { label: 'A3 (297mm * 420mm)', value: { type: "A3", w: 297, h: 420 } },
      { label: 'A4 (210mm * 297mm)', value: { type: "A4", w: 210, h: 297 } },
      { label: 'A5 (148mm * 210mm)', value: { type: "A5", w: 148, h: 210 } },
    ]

  }


  //textArea functions
  showTextDialog() {
    this.showDialogText = true;
  }

  saveTextBox() {
    if (this.value != "") {

      //add widget
      const widget: TextAreaWidget = new TextAreaWidget(0, 0, 3, this.value, TEXTTYPE.NORMAL);
      this._WidgetWrapperService.addTextWidget(this._WidgetWrapperService.widgets_textarea_collection, ReportGridWrapperComponent.gridstack_content, widget);
      this.closeTextDialog();
    }
    else {
      //not allowed to add empty text
      this._ToastrService.warning(".لايمكن اضافه نص فارغ");
    }
  }

  closeTextDialog() {
    this.showDialogText = false;
    this.value = "";
  }


  //image functions
  showImageDialog() {
    this.showDialogImage = true;
  }


  onUpdate = (files: FileList | any) => {
    if (files!.length > 0) {

      //get url as base64 
      this.imageUrl = window.URL.createObjectURL(files[0]);
      this.imagePreview.nativeElement.src = this.imageUrl;
      this.imageUploaded = true;
    }
  };

  saveImage() {
    if (this.imageUploaded) {
      //add widget                                                   //allowmoving //allowEditing //allowDeleting
      const widget: ImageWidget = new ImageWidget(0, 0, 2, this.imageUrl , false , false , false);
      this._WidgetWrapperService.addImageWidget(this._WidgetWrapperService.widgets_images_collection, ReportGridWrapperComponent.gridstack_content, widget);
      this.closeImageDialog();
    }
    else {
      //not allowed to add empty text
      this._ToastrService.warning(".لم يتم اختيار صورة");
    }
  }


  closeImageDialog() {
    this.showDialogImage = false;
    this.imageUploaded = false;
    this.imageUrl = "../../../assets/placeholder_image.png";
  }


  //export reporting
  exportReport() {

    //start loader
    this.reportLoader.nativeElement.classList.remove("d-none");
    this.cardContentReport.nativeElement.style.cssText = "border:none";

    document.querySelectorAll(".print-line").forEach((line: any) => line.style.display = "none");
    setTimeout(() => {
      //check selectExportType 
      switch (this.selectExportType) {
        case "excel":
          const exportScreenMode_excel: "landscape" | "portrait" | any = this.printSettings.screenMode == "default" ? "landscape" : this.printSettings.screenMode;
          this._ExportExcelService.exportToExcel(ReportGridWrapperComponent.gridstack_content, exportScreenMode_excel , "omar abdelmoniem");
          //stop loader
          this.reportLoader.nativeElement.classList.add("d-none");
          break;
        case "word":
          const exportScreenMode_word: "landscape" | "portrait" | any = this.printSettings.screenMode == "default" ? "landscape" : this.printSettings.screenMode;
          this._ExportWordService.exportToWord(ReportGridWrapperComponent.gridstack_content, exportScreenMode_word);
          //stop loader
          this.reportLoader.nativeElement.classList.add("d-none");
          break;
        default:
          //stop loader
          this.reportLoader.nativeElement.classList.add("d-none");
          this.displayExportation();
          break
      }

      setTimeout(() => {
        document.querySelectorAll(".print-line").forEach((line: any) => line.style.display = "block");
      }, 1000);

    }, 500);
  }

  printingReport() {


    //start loader
    this.reportLoader.nativeElement.classList.remove("d-none");
    // this.enableWaterMark = true;

    setTimeout(() => {

      this.displayExportation();

      setTimeout(() => {
        //stop loader
        this.reportLoader.nativeElement.classList.add("d-none");
      }, 1000);



    }, 500);

  }

  hideExportationSidebar(){
    this.exportationPreview.exportDivContents.forEach((exportDiv) => {
      exportDiv.nativeElement.innerHTML = ``;
    });
  }

}

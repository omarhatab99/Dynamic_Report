
import { AfterViewInit, Component, ComponentFactoryResolver, ElementRef, Input, OnInit , TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import Handsontable from 'handsontable';
import { registerLanguageDictionary } from 'handsontable/i18n';
import { HyperFormula } from 'hyperformula';
import { HotTableRegisterer } from '@handsontable/angular';
import { ContextMenu } from 'handsontable/plugins/contextMenu';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ExportFile } from 'handsontable/plugins';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import arAR from '../../constants/ar-AR';
import { UsersService } from '../../services/users.service';
import { ReportGridWrapperComponent } from '../report-grid-wrapper/report-grid-wrapper.component';
import { PrintingService } from '../../services/printing.service';
import { FunctionComponent } from '../../wrappers-tools/function/function.component';


export interface ITable {
  width: any;
  height: any;
  padding: any;
  title: any;
  thFontSize: any;
  tdFontSize: any;
  cellPadding: any;
  tcellsWidth: any;
  tcellsHeight: any;
}

//register Language internationalization handling
registerLanguageDictionary(arAR);

@Component({
  selector: 'app-table-grid-wrapper',
  templateUrl: './table-grid-wrapper.component.html',
  styleUrls: ['./table-grid-wrapper.component.css']
})
export class TableGridWrapperComponent implements OnInit, AfterViewInit {

  //vef container
  @ViewChild('functionContainer', { read: ViewContainerRef }) functionContainer!: ViewContainerRef;
  //viewchilds
  @ViewChild("tableBoxContainer") tableBoxContainer!: ElementRef;
  @ViewChild("dataSourceTable") dataSourceTable!: ElementRef;
  @ViewChild('hotTableContainer') hotTableContainer!: ElementRef;
  @ViewChild('hyperFormulaInput') hyperFormulaInput!: ElementRef;
  @ViewChild('topContainerTable') topContainerTable!: ElementRef;


  //template ref
  @ViewChild("settings") settingsTmpl!: TemplateRef<any>;

  /*
  
  width: '100%',
      height: 'auto',
      trimDropdown: false,
      className: 'htCenter',
      rowHeaders: true,
      filters: true,
      dropdownMenu: true,
      multiColumnSorting: true,
      manualRowMove: true,
      manualColumnMove: true,
      autoWrapRow: true,
      autoWrapCol: true,
      readOnly: false,
      manualColumnResize: true,
      manualColumnFreeze: true,
      mergeCells: true,
      layoutDirection: 'rtl',
      wordWrap: true,
      stretchH: "all",
      dragToScroll: true,
      colWidths: this.table.tcellsWidth,
      rowHeights: this.table.tcellsHeight,
      contextMenu: this.contextMenuItems,
  
  */

  //grid allowance configurations
  @Input() trimDropdown:boolean = false;
  @Input() filters:boolean = true;
  @Input() dropdownMenu:boolean = true;
  @Input() multiColumnSorting:boolean = true;
  @Input() manualRowMove:boolean = true;
  @Input() manualColumnMove:boolean = true;
  @Input() autoWrapRow:boolean = true;
  @Input() autoWrapCol:boolean = true;
  @Input() readonly:boolean = false;
  @Input() manualColumnResize:boolean = true;
  @Input() manualRowResize:boolean = true;
  @Input() manualColumnFreeze:boolean = true;
  @Input() mergeCells:boolean = true;
  @Input() wordWrap:boolean = true;
  @Input() dragToScroll:boolean = true;
  @Input() contextMenu:boolean = true;
  @Input() hasToolbarAndHyperFormula:boolean = true;
  @Input() showAddFunction:boolean = true;
  @Input() showRowHeader:boolean = true;
  @Input() showAdvancedEditor:boolean = true;
  @Input() showWordWrap:boolean = true;
  @Input() showScroll:boolean = true;
  @Input() showSelectedCols:boolean = true;
  @Input() allowDeleting:boolean = true;



  //gridSettings
  hotSettings!: Handsontable.GridSettings;
  hotRegisterer = new HotTableRegisterer();
  hotTableId: string = "hotInstance";
  hotInstance!: Handsontable;
  selectedRangeCells: any = {};
  language = 'ar-AR';
  //context menu items object
  contextMenuItems = {
    items: {
      'row_above': {},
      'row_below': {},
      'separator1': ContextMenu.SEPARATOR,
      'col_left': {},
      'col_right': {},
      'separator2': ContextMenu.SEPARATOR,
      'remove_row': {},
      'remove_col': {},
      'clear_column': {},
      'separator3': ContextMenu.SEPARATOR,
      'undo': {},
      'redo': {},
      'separator4': ContextMenu.SEPARATOR,
      'make_read_only': {},
      'separator5': ContextMenu.SEPARATOR,
      'alignment': {},
      'separator6': ContextMenu.SEPARATOR,
      'cut': {},
      'copy': {},
      'separator7': ContextMenu.SEPARATOR,
      'freeze_column': {},
      'unfreeze_column': {},
      'separator8': ContextMenu.SEPARATOR,
      'mergeCells': {},
      'separator10': ContextMenu.SEPARATOR,
      createCharts: {
        name: 'اضافه رسم بيانى',
        callback: () => {},
      },
      'separator11': ContextMenu.SEPARATOR,
      createHyperformula: {
        name: 'اضافه عمليه على هذة الخليه',
        callback: () => this.handeHyperFormulaOnSelectedCell(),
      },

    },

  }
  
  exportPlugin!: ExportFile;

  //table objects
  table: ITable = {} as ITable;
  settingsId: any;

  //statics
  static tableStatic: TableGridWrapperComponent[] = [];

  //itemSource
  itemSource: any[] = [];
  //itemSource
  itemSource_data: any[] = [];
  //itemSource columns
  itemSource_cols: any[] = [];
  //itemSource columns_selected
  itemSource_options: any[] = [];
  _itemSource_cols_selected: any[] = [];
  //customize toolbar
  toolbarCustomize: any = { isBold: false, isItalic: false, isUnderline: false, fontFamily: "Cairo, sans-serif", fontSize: 16, backgroundColor: "#FFF", color: "#000" };

  //hyperFormula
  contextMenuHyperFormulaCellCoords: Handsontable.CellCoords | null = null;
  hyperFormulaTextAreaActive: boolean = true;
  currentValueOfCell: string = "";

  //options
  fontFamilyOptions: any[] = [];
  fontSizeOptions: any[] = [];
  //multiselectOptions


  constructor(private _usersService: UsersService, private _ReportGridWrapperComponent: ReportGridWrapperComponent, private _ComponentFactoryResolver: ComponentFactoryResolver, private _ToastrService: ToastrService, private _PrintingService: PrintingService) { }

  //functions
  functionSelected: any[] = [];

  //configuration options
  table_rowheader: boolean = true;
  table_editor: boolean = true;
  table_wordwrap: boolean = true;
  table_height: boolean = false;

  //this property changed from other component
  enable_rowheader_option: boolean = true
  enable_editor_option: boolean = true
  enable_wordwrap_option: boolean = true
  enable_scroll_option: boolean = true

  set itemsource_cols_Selected(val: any) {

    this._itemSource_cols_selected = val;


    const selectedFields = this._itemSource_cols_selected.map((obj: any) => Object.values(obj)[0]);

    const selectedData = this.itemSource_data.map((element) => {
      let object: any = {};
      selectedFields.forEach((field: any) => { object[field] = element[field] });
      return object;
    });



    //assign column headers to itemsource_cols 
    this.itemSource_cols = Object.keys(selectedData[0]);
    //assign response to itemsource 
    this.itemSource = selectedData.map((obj: any) => Object.values(obj));

  }

  get itemsource_cols_Selected() {
    return this._itemSource_cols_selected
  }


  ngOnInit(): void {

    //default values
    this.settingsId = this.getRandomId();
    this.table.width = 100;
    this.table.tcellsWidth = undefined;
    this.table.tcellsHeight = undefined;

    //add table to static array
    TableGridWrapperComponent.tableStatic.push(this);

    this._usersService.getAllUsers().subscribe((response) => {

      this.itemSource_data = response;

      //assign column headers to itemsource_cols 
      this.itemSource_cols = Object.keys(this.itemSource_data[0]);
      //assign response to itemsource 
      this.itemSource = this.itemSource_data.map((obj: any) => Object.values(obj));

      //assign itemsource_options
      this.itemSource_options = this.itemSource_cols.map((element) => { return { field: element, header: element } });
      this._itemSource_cols_selected = this.itemSource_options;

      console.log("ITEMSOURCE :" , this.itemSource);
      console.log("ITEMSOURCE COLS :" , this.itemSource_cols);


    });


    //this function handle grid settings
    this.handleGridSettings();

    this.setupOptionsForCompoBoxAndMultiSelect();
  }


  ngAfterViewInit(): void {


    this.hotInstance = this.hotRegisterer.getInstance(this.hotTableId);
    this.exportPlugin = this.hotInstance.getPlugin('exportFile');
    this.addHooks();

    Promise.resolve().then(() => this._ReportGridWrapperComponent.showHeaderTemplate(this.settingsTmpl));

    this.hotInstance.rootElement.prepend(this.topContainerTable.nativeElement);

  }

  //this function handle grid settings
  handleGridSettings() {
    this.hotSettings = {
      width: '100%',
      height: 'auto',
      trimDropdown: this.trimDropdown,
      className: 'htCenter',
      rowHeaders: true,
      filters: this.filters,
      dropdownMenu: this.dropdownMenu,
      multiColumnSorting: this.multiColumnSorting,
      manualRowMove: this.manualRowMove,
      manualColumnMove: this.manualColumnMove,
      autoWrapRow: this.autoWrapRow,
      autoWrapCol: this.autoWrapCol,
      readOnly: this.readonly,
      manualColumnResize: this.manualColumnResize,
      manualRowResize: this.manualRowResize,
      manualColumnFreeze: this.manualColumnFreeze,
      mergeCells: this.mergeCells,
      layoutDirection: 'rtl',
      wordWrap: this.wordWrap,
      stretchH: "all",
      dragToScroll: this.dragToScroll,
      colWidths: this.table.tcellsWidth,
      rowHeights: this.table.tcellsHeight,
      contextMenu: this.contextMenu == true ? this.contextMenuItems: undefined,

      afterSelectionEnd: (row: number, col: number, row2: number, col2: number) => {
        if (col > col2 && row > row2)
          this.selectedRangeCells = { row: row2, col: col2, row2: row, col2: col };
        else if (col > col2)
          this.selectedRangeCells = { row, col: col2, row2, col2: col };
        else if (row > row2)
          this.selectedRangeCells = { row: row2, col, row2: row, col2 };
        else
          this.selectedRangeCells = { row, col, row2, col2 };


        if (this.selectedRangeCells.row == -1)
          this.selectedRangeCells.row = 0;

        if (this.selectedRangeCells.col == -1)
          this.selectedRangeCells.col = 0;

        this.isActiveToolbarProperties();
      },
      afterColumnResize: () => {
        this.hotInstance.updateSettings({ rowHeaders: true });

        if (this._PrintingService.sharedMode != "default" || !this.table_rowheader)
          this.hotInstance.updateSettings({ rowHeaders: false });

      }
      ,
      formulas: {
        engine: HyperFormula
      },

      licenseKey: 'non-commercial-and-evaluation',

    };

  }

  onTableRowHeader(event: any) {
    if (event.checked) {
      this.table_rowheader = true;
      this.hotInstance.updateSettings({ rowHeaders: true });
    }
    else {
      this.table_rowheader = false;
      this.hotInstance.updateSettings({ rowHeaders: false });
    }
  }

  onTableEditor(event: any) {
    if (event.checked) {
      this.table_editor = true;
      //handle dom
      this.topContainerTable.nativeElement.style.cssText = "display:block !important";
      this.hotTableContainer.nativeElement.style.cssText = "padding-top:90px !important";
    }
    else {
      this.table_editor = false;
      //handle dom
      this.topContainerTable.nativeElement.style.cssText = "display:none !important";
      this.hotTableContainer.nativeElement.style.cssText = "padding-top:0px !important";
    }


  }

  onTableWordwrap(event: any) {
    if (event.checked) {
      this.table_wordwrap = true;
      this.hotInstance.updateSettings({ wordWrap: true });
    }
    else {
      this.table_wordwrap = false;
      this.hotInstance.updateSettings({ wordWrap: false });
    }
  }

  onTableHeight(event: any) {
    if (event.checked) {
      this.table_height = true;
      this.hotInstance.updateSettings({ height: "500px" });
    }
    else {
      this.table_height = false;
      this.hotInstance.updateSettings({ height: "auto" });
    }
  }




  //this function is a container of hooks
  addHooks() {

    this.hotInstance.addHook('afterSelectionEnd', (row, col, row2, col2) => {
      if (!this.hyperFormulaTextAreaActive) {
        this.setCellNameIntoTextArea(row, col, row2, col2);
      }

    });

  }

  //this function handle options of compo box and multiselect
  setupOptionsForCompoBoxAndMultiSelect() {

    this.fontFamilyOptions = [
      { label: "Cairo, sans-serif", value: "Cairo, sans-serif" },
      { label: "'IBM Plex Sans Arabic'", value: "'IBM Plex Sans Arabic'" },
      { label: "'Rubik', sans-serif", value: "'Rubik', sans-serif" },
      { label: '"Amiri", serif', value: '"Amiri", serif' },
      { label: "times-new-roman", value: "times-new-roman" },
      { label: "arial", value: "arial" },
    ];

    this.fontSizeOptions = [
      { label: "10", value: "10" },
      { label: "12", value: "12" },
      { label: "14", value: "14" },
      { label: '16', value: '16' },
      { label: "18", value: "18" },
      { label: "20", value: "20" },
    ];


  }



  //create new function
  createNewFunction() {
    if (FunctionComponent.functionStatic.length == 5) {

      this._ToastrService.warning("الحد الاقصى 5..!!")

    }
    else {
      const componentFactory = this._ComponentFactoryResolver.resolveComponentFactory(FunctionComponent);
      this.functionContainer.createComponent(componentFactory).instance;
    }

  }


  //exportation
  exportPdf() {
    //start loader
    document.getElementById("reportLoader")?.classList.remove("d-none");
    //handle dom
    this.topContainerTable.nativeElement.style.cssText = "display:none !important";
    this.hotTableContainer.nativeElement.style.cssText = "padding-top:0px !important";
    TableGridWrapperComponent.tableStatic.forEach((component) => {
      component.hotInstance.updateSettings({ rowHeaders: false, height: "auto" });
      component.hotInstance.render();
    });

    //this.exportColumns = this.selectedColumns.map(col => ({ title: col.header, dataKey: col.field }));


    setTimeout(() => {
      //stop loader
      document.getElementById("reportLoader")?.classList.add("d-none");
      html2canvas(this.dataSourceTable.nativeElement).then((imageCanvas) => {

        const imgData = imageCanvas.toDataURL("image/png");
        var imgWidth = 295;
        var pageHeight = 210;
        var imgHeight = imageCanvas.height * imgWidth / imageCanvas.width;
        var heightLeft = imgHeight;

        var doc = new jsPDF("l", 'mm', 'a4');

        var position = 5;

        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = (heightLeft - imgHeight)
          doc.addPage();
          doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        doc.save('reporting_table' + '.pdf')
      });

      setTimeout(() => {
        //handle dom
        this.topContainerTable.nativeElement.style.cssText = "display:block !important";
        this.hotTableContainer.nativeElement.style.cssText = "padding-top:90px !important";
        TableGridWrapperComponent.tableStatic.forEach((component) => {
          if (component.table_height) {
            component.hotInstance.updateSettings({ rowHeaders: true, height: "500px" });
            component.hotInstance.render();
          }
        });

        //update grid dynamically
        // this._WidgetWrapperService.updateAllWidgetDynamically(ReportGridWrapperComponent.gridstack_tables);
        document.querySelectorAll(".print-line").forEach((line: any) => line.style.display = "block");

      }, 1000)

    }, 500);


  }


  //export excel
  exportExcel() {


    this.exportPlugin.downloadFile('csv', {
      bom: false,
      columnDelimiter: ',',
      columnHeaders: false,
      exportHiddenColumns: true,
      exportHiddenRows: true,
      fileExtension: 'csv',
      filename: 'Dynamic_Report',
      mimeType: 'text/csv',
      rowDelimiter: '\r\n',
      rowHeaders: true,
    });



  }


  //toolbar edit----------------------------------------------------------
  //this function fix color palette overlay 
  fixedColorPalette() {
    const colorPanelOverlay = document.querySelector(".ngx-colors-overlay") as HTMLElement;
    colorPanelOverlay?.remove();
    this.hotInstance.rootElement.appendChild(colorPanelOverlay);
  }

  fixedOverlayColors(event: any) {
    if (event.target.id == "ngx-colors-overlay") {
      this.hotInstance.render();
    }

  }

  applyHighLightColor(color: any) {

    const cells = this.getRangeCellFromRangeCoords(this.selectedRangeCells);
    cells.forEach((element) => element.cell.style.cssText = `background-color: ${color} !important;`);

  }

  changeMetaHighlight(event: any) {
    const cells = this.getRangeCellFromRangeCoords(this.selectedRangeCells);
    const backgroundClassName = this.addDynamicCSS("cell-highlight", `{background-color:${event} !important;}`)
    cells.forEach((element) => {
      let classListCell: string = element.className;
      if (element.className?.includes("cell-highlight-settings")) {
        const classListArray: any[] = element.className.split(" ");
        const classIndex = classListArray.findIndex((element) => element.includes("cell-highlight-settings"));
        classListArray.splice(classIndex, 1);
        classListCell = classListArray.join(" ");

      }

      classListCell = `${classListCell} ${backgroundClassName}`

      this.hotInstance.setCellMeta(element.coords.row, element.coords.col, "className", classListCell);
    });

    this.isActiveToolbarProperties();
    this.hotInstance.render();
  }

  applyFontColor(color: any) {

    const cells = this.getRangeCellFromRangeCoords(this.selectedRangeCells);
    cells.forEach((element) => element.cell.style.cssText = `color: ${color} !important;`);
  }

  changeMetaFontColor(event: any) {
    const cells = this.getRangeCellFromRangeCoords(this.selectedRangeCells);
    const backgroundClassName = this.addDynamicCSS("cell-fontColor", `{color:${event} !important;}`)
    cells.forEach((element) => {
      let classListCell: string = element.className;
      if (element.className?.includes("cell-fontColor-settings")) {
        const classListArray: any[] = element.className.split(" ");
        const classIndex = classListArray.findIndex((element) => element.includes("cell-fontColor-settings"));
        classListArray.splice(classIndex, 1);
        classListCell = classListArray.join(" ");

      }

      classListCell = `${classListCell} ${backgroundClassName}`

      this.hotInstance.setCellMeta(element.coords.row, element.coords.col, "className", classListCell);
    });

    this.isActiveToolbarProperties();
    this.hotInstance.render();
  }

  changeMetaTextAlign(position: string) {
    const cells = this.getRangeCellFromRangeCoords(this.selectedRangeCells);
    const backgroundClassName = this.addDynamicCSS("cell-textAlign", `{text-align:${position} !important;}`)
    cells.forEach((element) => {
      let classListCell: string = element.className;
      if (element.className?.includes("cell-textAlign-settings")) {
        const classListArray: any[] = element.className.split(" ");
        const classIndex = classListArray.findIndex((element) => element.includes("cell-textAlign-settings"));
        classListArray.splice(classIndex, 1);
        classListCell = classListArray.join(" ");

      }

      classListCell = `${classListCell} ${backgroundClassName}`

      this.hotInstance.setCellMeta(element.coords.row, element.coords.col, "className", classListCell);
    });

    this.isActiveToolbarProperties();
    this.hotInstance.render();
  }

  changeMetaFontFamily(event: any) {

    const cells = this.getRangeCellFromRangeCoords(this.selectedRangeCells);
    const backgroundClassName = this.addDynamicCSS("cell-fontFamily", `{font-family:${event.target.value} !important;}`)
    cells.forEach((element) => {
      let classListCell: string = element.className;
      if (element.className?.includes("cell-fontFamily-settings")) {
        const classListArray: any[] = element.className.split(" ");
        const classIndex = classListArray.findIndex((element) => element.includes("cell-fontFamily-settings"));
        classListArray.splice(classIndex, 1);
        classListCell = classListArray.join(" ");

      }

      classListCell = `${classListCell} ${backgroundClassName}`

      this.hotInstance.setCellMeta(element.coords.row, element.coords.col, "className", classListCell);
    });

    this.isActiveToolbarProperties();
    this.hotInstance.render();
  }

  changeMetaFontSize(event: any) {
    const cells = this.getRangeCellFromRangeCoords(this.selectedRangeCells);
    const fontSizeClassName = this.addDynamicCSS("cell-fontSize", `{font-size:${event.target.value}px !important;}`)
    cells.forEach((element) => {
      let classListCell: string = element.className;
      if (element.className?.includes("cell-fontSize-settings")) {
        const classListArray: any[] = element.className.split(" ");
        const classIndex = classListArray.findIndex((element) => element.includes("cell-fontSize-settings"));
        classListArray.splice(classIndex, 1);
        classListCell = classListArray.join(" ");

      }

      classListCell = `${classListCell} ${fontSizeClassName}`

      this.hotInstance.setCellMeta(element.coords.row, element.coords.col, "className", classListCell);
    });

    this.hotInstance.render();
  }

  changeMetaFontBold() {

    const cells = this.getRangeCellFromRangeCoords(this.selectedRangeCells);
    const boldClassName = this.addDynamicCSS("cell-bold", `{font-weight:bold !important;}`)

    //check if all of cells has same class
    const allHasSameClass: boolean = cells.every((element) => element.className.includes("cell-bold-settings"));

    //check if all of cells has same class
    if (allHasSameClass) {
      cells.forEach((element) => {
        const classListArray: any[] = element.className.split(" ");
        const classIndex = classListArray.findIndex((element) => element.includes("cell-bold-settings"));
        classListArray.splice(classIndex, 1);
        let classListCell: string = classListArray.join(" ");
        this.hotInstance.setCellMeta(element.coords.row, element.coords.col, "className", classListCell);
      });
    }
    else {
      cells.forEach((element) => {
        let classListCell: string = element.className;
        if (element.className?.includes("cell-bold-settings")) {
          const classListArray: any[] = element.className.split(" ");
          const classIndex = classListArray.findIndex((element) => element.includes("cell-bold-settings"));
          classListArray.splice(classIndex, 1);
          classListCell = classListArray.join(" ");

        }

        classListCell = `${classListCell} ${boldClassName}`

        this.hotInstance.setCellMeta(element.coords.row, element.coords.col, "className", classListCell);
      });

    }

    this.isActiveToolbarProperties();
    this.hotInstance.render();
  }

  changeMetaFontItalic() {
    const cells = this.getRangeCellFromRangeCoords(this.selectedRangeCells);
    const italicClassName = this.addDynamicCSS("cell-italic", `{font-style:italic !important;}`)

    //check if all of cells has same class
    const allHasSameClass: boolean = cells.every((element) => element.className.includes("cell-italic-settings"));

    //check if all of cells has same class
    if (allHasSameClass) {
      cells.forEach((element) => {
        const classListArray: any[] = element.className.split(" ");
        const classIndex = classListArray.findIndex((element) => element.includes("cell-italic-settings"));
        classListArray.splice(classIndex, 1);
        let classListCell: string = classListArray.join(" ");
        this.hotInstance.setCellMeta(element.coords.row, element.coords.col, "className", classListCell);
      });
    }
    else {
      cells.forEach((element) => {
        let classListCell: string = element.className;
        if (element.className?.includes("cell-italic-settings")) {
          const classListArray: any[] = element.className.split(" ");
          const classIndex = classListArray.findIndex((element) => element.includes("cell-italic-settings"));
          classListArray.splice(classIndex, 1);
          classListCell = classListArray.join(" ");
        }

        classListCell = `${classListCell} ${italicClassName}`

        this.hotInstance.setCellMeta(element.coords.row, element.coords.col, "className", classListCell);
      });

    }

    this.isActiveToolbarProperties();
    this.hotInstance.render();
  }

  changeMetaFontUnderline() {
    const cells = this.getRangeCellFromRangeCoords(this.selectedRangeCells);
    const underlineClassName = this.addDynamicCSS("cell-underline", `{text-decoration:underline !important;}`)

    //check if all of cells has same class
    const allHasSameClass: boolean = cells.every((element) => element.className.includes("cell-underline-settings"));

    //check if all of cells has same class
    if (allHasSameClass) {
      cells.forEach((element) => {
        const classListArray: any[] = element.className.split(" ");
        const classIndex = classListArray.findIndex((element) => element.includes("cell-underline-settings"));
        classListArray.splice(classIndex, 1);
        let classListCell: string = classListArray.join(" ");
        this.hotInstance.setCellMeta(element.coords.row, element.coords.col, "className", classListCell);
      });
    }
    else {
      cells.forEach((element) => {
        let classListCell: string = element.className;
        if (element.className?.includes("cell-underline-settings")) {
          const classListArray: any[] = element.className.split(" ");
          const classIndex = classListArray.findIndex((element) => element.includes("cell-underline-settings"));
          classListArray.splice(classIndex, 1);
          classListCell = classListArray.join(" ");
        }

        classListCell = `${classListCell} ${underlineClassName}`

        this.hotInstance.setCellMeta(element.coords.row, element.coords.col, "className", classListCell);
      });

    }
    this.isActiveToolbarProperties();
    this.hotInstance.render();
  }

  isActiveToolbarProperties() {

    const rangeCells = this.getRangeCellFromRangeCoords(this.selectedRangeCells);

    if (rangeCells.length == 0)
      return;

    //check if all of cells has same class
    const allHasSameClassBold: boolean = rangeCells.every((element) => element.className.includes("cell-bold-settings"));
    this.toolbarCustomize.isBold = allHasSameClassBold ? true : false;

    //check if all of cells has same class
    const allHasSameClassItalic: boolean = rangeCells.every((element) => element.className.includes("cell-italic-settings"));
    this.toolbarCustomize.isItalic = allHasSameClassItalic ? true : false;

    //check if all of cells has same class
    const allHasSameClassUnderline: boolean = rangeCells.every((element) => element.className.includes("cell-underline-settings"));
    this.toolbarCustomize.isUnderline = allHasSameClassUnderline ? true : false;

    //check if all of cells has same class
    const allHasSameClassTextAlign: boolean = rangeCells.every((element) => element.className.includes("cell-textAlign-settings"));
    setTimeout(() => { this.toolbarCustomize.textAlign = (allHasSameClassTextAlign) ? getComputedStyle(rangeCells[0].cell).textAlign : "center"; }, 0)
    //check if all of cells has same class
    const allHasSameClassFontColor: boolean = rangeCells.every((element) => element.className.includes("cell-fontColor-settings"));
    setTimeout(() => { this.toolbarCustomize.color = (allHasSameClassFontColor) ? getComputedStyle(rangeCells[0].cell).color : "#000"; }, 0);

    //check if all of cells has same class
    const allHasSameClassBackground: boolean = rangeCells.every((element) => element.className.includes("cell-highlight-settings"));
    setTimeout(() => { this.toolbarCustomize.backgroundColor = (allHasSameClassBackground) ? getComputedStyle(rangeCells[0].cell).backgroundColor : "#FFF"; }, 0);

    //check if all of cells has same class
    const allHasSameClassFontFamily: boolean = rangeCells.every((element) => element.className.includes("cell-fontFamily-settings"));
    setTimeout(() => { this.toolbarCustomize.fontFamily = (allHasSameClassFontFamily) ? getComputedStyle(rangeCells[0].cell).fontFamily : "Cairo, sans-serif"; }, 0);

    //check if all of cells has same class
    const allHasSameClassFontSize: boolean = rangeCells.every((element) => element.className.includes("cell-fontSize-settings"));
    setTimeout(() => { this.toolbarCustomize.fontSize = (allHasSameClassFontSize) ? getComputedStyle(rangeCells[0].cell).fontSize.slice(0, 2) : '16'; }, 0);

  }


  //return range cell from range cell coords
  getRangeCellFromRangeCoords(range: any): any[] {
    const rangeCells: any[] = [];

    for (let r = range.row; r <= range.row2; r++) {
      for (let c = range.col; c <= range.col2; c++) {
        const cell = this.hotInstance.getCell(r, c);
        const className = this.hotInstance.getCellMeta(r, c).className;
        const coords = { row: r, col: c };
        const cellObject = { cell, className, coords };
        rangeCells.push(cellObject);
      }
    }

    return rangeCells;
  }



  addDynamicCSS(name: string, props: string): string {
    const className = `${name}-${this.getRandomId()}`;
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = `
      .${className} ${props}
    `;
    document.head.appendChild(styleSheet);
    // Apply the new class

    return className;
  }



  //hyperFormula functions-------------------------------------------------------------------------------------------------------------------------------------------------------------------------



  //this function handle selected cell for hyperFormula and textArea
  handeHyperFormulaOnSelectedCell() {


    const selectedCellForFormula = this.getRangeCellFromRangeCoords(this.selectedRangeCells)[0];
    this.contextMenuHyperFormulaCellCoords = selectedCellForFormula.coords;

    //deselect to remove selection from cell
    this.hotInstance.deselectCell();
    this.hotInstance.getCellsMeta()
    //get classlist for cell
    let classListCell = `${selectedCellForFormula.className} hyperFormula-active`;
    //add class hyperFormula-active for target selected cell
    this.hotInstance.setCellMeta(selectedCellForFormula.coords.row, selectedCellForFormula.coords.col, 'className', classListCell);
    //get current value of cell
    this.currentValueOfCell = this.hotInstance.getDataAtCell(selectedCellForFormula.coords.row, selectedCellForFormula.coords.col);
    //change cell value
    this.hotInstance.setDataAtCell(selectedCellForFormula.coords.row, selectedCellForFormula.coords.col, "?=");

    //update settings to disable contextMenu
    this.hotInstance.updateSettings({ contextMenu: false, dropdownMenu: false, manualRowMove: false, manualColumnMove: false });

    //render hotTable again
    this.hotInstance.render(); // Refresh the table to apply the changes

    document.getElementById("hyperFormulaHiddenBtn")?.click();

  }

  //this function execute some things
  doBadOperationOnHyperFormulaTextArea() {
    this.hyperFormulaTextAreaActive = false;
    setTimeout(() => {
      this.hyperFormulaInput.nativeElement.value = "";
      this.hyperFormulaInput.nativeElement.focus();
    }, 0);
  }



  //this function use to set cell name into textarea after click any cell other selected cell
  setCellNameIntoTextArea(row: any, col: any, row2: any, col2: any) {
    let cellName;

    if (row == row2 && col == col2) {
      cellName = getCellName(row, col);
    }
    else {
      cellName = this.getRangeNames(row, col, row2, col2);
    }

    this.handleHyperFormulaTextAreaAfterClicked(cellName);

    //--------------------------------------------------------------------------------
    function getCellName(row: number, column: number): string {
      const columnLetter = columnToLetter(column);
      // Row numbers are 1-based in Excel, so add 1 to the zero-based row index
      const cellName = `${columnLetter}${row + 1}`;
      return cellName;
    }

    function columnToLetter(column: number): string {
      let letter = '';
      while (column >= 0) {
        letter = String.fromCharCode((column % 26) + 65) + letter;
        column = Math.floor(column / 26) - 1;
      }
      return letter;
    }
  }


  //newwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwws


  colToLetter(col: any) {
    let letter = '';
    while (col >= 0) {
      letter = String.fromCharCode((col % 26) + 65) + letter;
      col = Math.floor(col / 26) - 1;
    }
    return letter
  }



  getRangeNames(startRow: any, startCol: any, endRow: any, endCol: any) {
    // Convert coordinates to cell references
    const startCell = this.colToLetter(startCol) + (startRow + 1);
    const endCell = this.colToLetter(endCol) + (endRow + 1);

    // Format the range string
    return `${startCell}:${endCell}`;
  }

  //end newwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwws

  //this function handle textArea hyperFormula like excel
  handleHyperFormulaTextAreaAfterClicked(cellName: string) {
    let arthmaticOperation = ["+", "-", "/", "*", "%"];

    //get cursor position
    const cursorPosition = this.hyperFormulaInput.nativeElement.selectionStart ?? 0;

    let arrayFromStartToCursorText = this.splitStringWithOperators(this.hyperFormulaInput.nativeElement.value.slice(0, cursorPosition));
    let hyperFormulaInputArray = this.splitStringWithOperators(this.hyperFormulaInput.nativeElement.value);


    //check if hyperFormula value is empty
    if (hyperFormulaInputArray.length > 0) {
      const lastElementInArray = arrayFromStartToCursorText[arrayFromStartToCursorText.length - 1];
      if (!arthmaticOperation.includes(lastElementInArray) && !this.isNumericString(lastElementInArray) && lastElementInArray != "(" && lastElementInArray != ")") {
        arrayFromStartToCursorText[arrayFromStartToCursorText.length - 1] = cellName;
        hyperFormulaInputArray = [...arrayFromStartToCursorText, ...hyperFormulaInputArray.slice(arrayFromStartToCursorText.length)];
      }
      else {
        arrayFromStartToCursorText.push(cellName);
        hyperFormulaInputArray = [...arrayFromStartToCursorText, ...hyperFormulaInputArray.slice(arrayFromStartToCursorText.length - 1)];
      }

    }
    else {
      arrayFromStartToCursorText.push(cellName);
      hyperFormulaInputArray = [...arrayFromStartToCursorText, ...hyperFormulaInputArray.slice(arrayFromStartToCursorText.length - 1)];

    }

    this.hyperFormulaInput.nativeElement.value = hyperFormulaInputArray.join("");
    this.hyperFormulaInput.nativeElement.focus();

    //how to highlight selected cell in operation
    hyperFormulaInputArray = this.splitStringWithOperators(this.hyperFormulaInput.nativeElement.value);
    const cellNames = this.extractCellNames(hyperFormulaInputArray);

    this.removeAllCellMeta();

    cellNames.forEach(cellName => {
      const cellCoords = this.cellNameToCoords(cellName);
      const cell = this.hotInstance.getCellMeta(cellCoords.row, cellCoords.col);
      let classListCell = `${cell.className} hyperFormula-selected-active`;

      this.hotInstance.setCellMeta(cellCoords.row, cellCoords.col, "className", classListCell);
    });

    this.hotInstance.deselectCell();
    this.hotInstance.render();
  }

  //this function handle textArea hyperFormula in case of delete keyup event
  handlHyperFormulaInputInCaseDelete(event: KeyboardEvent) {

    if (event.key == "Backspace") {
      const hotInstance = this.hotRegisterer.getInstance(this.hotTableId);

      let hyperFormulaInputArray = this.splitStringWithOperators(this.hyperFormulaInput.nativeElement.value);
      const cellNames = this.extractCellNames(hyperFormulaInputArray);
      this.removeAllCellMeta();

      cellNames.forEach(cellName => {
        const cellCoords = this.cellNameToCoords(cellName);
        hotInstance.setCellMeta(cellCoords.row, cellCoords.col, "className", "hyperFormula-selected-active");
      });
      hotInstance.render();
    }

  }

  //this function execute hyperFormula
  saveHyperFormula() {

    if (this.contextMenuHyperFormulaCellCoords && !this.hyperFormulaTextAreaActive) {

      //get instance from handsontable
      const { row, col } = this.contextMenuHyperFormulaCellCoords;

      //handle hyperFormula
      const hyperFormulaValue = "=" + this.hyperFormulaInput.nativeElement.value;

      //set hyperFormula at selected cell
      this.hotInstance.setDataAtCell(row, col, hyperFormulaValue);

      //reset hyperFormula input
      this.hyperFormulaInput.nativeElement.value = "";
      this.hyperFormulaTextAreaActive = true;

      //reset selected cell behavior
      this.hotInstance.selectCell(row, col);

      const cell = this.hotInstance.getCellMeta(row, col);
      if (cell.className?.includes("hyperFormula-active")) {
        let classListCell = cell.className.toString().replace("hyperFormula-active", "");
        this.hotInstance.setCellMeta(row, col, "className", classListCell);
      }

      this.removeAllCellMeta();

      //update settings to enable contextMenu
      this.hotInstance.updateSettings({
        contextMenu: this.contextMenuItems,
        dropdownMenu: true,
        manualRowMove: true,
        manualColumnMove: true
      });

      //reset other
      this.contextMenuHyperFormulaCellCoords = null;
      this.hyperFormulaTextAreaActive = true;

      //render hotTable again
      this.hotInstance.render(); // Refresh the table to apply the changes
    }

  }

  //this function cancel hyperFormula
  cancelHyperFormula() {

    if (this.contextMenuHyperFormulaCellCoords && !this.hyperFormulaTextAreaActive) {

      //get instance from handsontable
      const { row, col } = this.contextMenuHyperFormulaCellCoords;

      this.hotInstance.setDataAtCell(row, col, this.currentValueOfCell);

      //reset hyperFormula input
      this.hyperFormulaInput.nativeElement.value = "";
      this.hyperFormulaTextAreaActive = true;

      //reset selected cell behavior
      this.hotInstance.selectCell(row, col);

      //remove meta from all selected cells
      this.removeAllCellMeta();

      const cell = this.hotInstance.getCellMeta(row, col);
      if (cell.className?.includes("hyperFormula-active")) {
        let classListCell = cell.className.toString().replace("hyperFormula-active", "");
        this.hotInstance.setCellMeta(row, col, "className", classListCell);
      }

      //update settings to enable contextMenu
      this.hotInstance.updateSettings({
        contextMenu: this.contextMenuItems,
        dropdownMenu: true,
        manualRowMove: true,
        manualColumnMove: true
      });

      //reset other
      this.contextMenuHyperFormulaCellCoords = null;
      this.hyperFormulaTextAreaActive = true;
      //render hotTable again
      this.hotInstance.render(); // Refresh the table to apply the changes

    }

  }

  //this function clear hyperFormula
  clearHyperFormula() {
    this.hyperFormulaInput.nativeElement.value = "";

    //remove meta from all selected cells
    this.removeAllCellMeta();
  }

  private extractCellNames(array: (string | number)[]): string[] {
    const cellNameRegex = /^[A-Z]+\d+$/;
    return array.filter(item => typeof item === 'string' && cellNameRegex.test(item)) as string[];
  }

  private cellNameToCoords(cellName: string): { row: number, col: number } {
    // الحصول على الحرف والرقم من اسم الخلية
    const match = cellName.match(/^([A-Z]+)(\d+)$/);
    if (!match) throw new Error('Invalid cell name');

    const colStr = match[1];
    const row = parseInt(match[2], 10) - 1; // تحويل الرقم في اسم الخلية إلى صفر

    // تحويل الحرف إلى رقم عمود
    let col = 0;
    for (let i = 0; i < colStr.length; i++) {
      col = col * 26 + (colStr.charCodeAt(i) - 'A'.charCodeAt(0));
    }

    return { row, col };
  }

  private removeAllCellMeta() {
    const data = this.hotInstance.getData();

    for (let row = 0; row < data.length; row++) {
      for (let col = 0; col < data[row].length; col++) {
        if (row == this.contextMenuHyperFormulaCellCoords?.row && col == this.contextMenuHyperFormulaCellCoords?.col) {
          continue;
        }

        const cell = this.hotInstance.getCellMeta(row, col);
        if (cell.className?.includes("hyperFormula-selected-active")) {
          let classListCell = cell.className.toString().replace("hyperFormula-selected-active", "");
          this.hotInstance.setCellMeta(row, col, "className", classListCell);
        }

      }
    }

    this.hotInstance.render();
  }

  //split value of input in special case
  private splitStringWithOperators(input: string): string[] {
    // Regular expression to split by +, -, /, *, or % but include the operators in the result
    const regex = /([+\-/*%)()])/g;

    // Use match method with regex to get an array of parts including the operators
    return input.split(regex).filter(part => part.length > 0 || part in ['+', '-', '/', '*', '%']);
  }

  //check numeric type
  private isNumericString(value: string): boolean {
    return !isNaN(parseFloat(value)) && isFinite(parseFloat(value));
  }


  //remove widget
  removeTable() {

    Swal.fire({
      title: "هل انت متاكد من حذف العنصر؟",
      text: "لن تكون قادر على استعادته مرة اخرى",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم احذف",
      cancelButtonText: "تجاهل"
    }).then((result) => {
      if (result.isConfirmed) {
        //Actual logic to perform a confirmation
        this.tableBoxContainer.nativeElement.remove();
        this.settingsTmpl.elementRef.nativeElement.remove();
        this._ReportGridWrapperComponent.headerTemplate = [];
        TableGridWrapperComponent.tableStatic = [];

        try {

          Swal.fire({
            position: "center",
            icon: "success",
            title: "تم حذف العنصر بنجاح",
            showConfirmButton: false,
            timer: 1500
          });

        }
        catch (error: any) {
          Swal.fire({
            position: "center",
            title: "حدث خطأ",
            text: "حدث خطأ اثناء تنفيذ العمليه",
            icon: "error",
            showConfirmButton: false,
          });
        }
      }

    });

  }


  //get random id
  getRandomId(): string {
    const random = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    return `settings-${random}`;
  }


}


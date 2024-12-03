import { AfterViewInit, Component, ComponentFactoryResolver, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { NestedPyramidGridWrapperComponent } from '../nested-pyramid-grid-wrapper/nested-pyramid-grid-wrapper.component';
import { NgxPrintElementService } from 'ngx-print-element';
import { PrepareExportationComponent } from '../../wrappers-others/prepare-exportation/prepare-exportation.component';
import { PrintingService } from '../../services/printing.service';
import { AppComponent } from 'src/app/app.component';
import { PrintingLoaderComponent } from '../../wrappers-others/printing-loader/printing-loader.component';
import { ExportExcelService } from '../../services/export-excel.service';
import { ExportWordService } from '../../services/export-word.service';

@Component({
  selector: 'app-tabs-wrapper',
  templateUrl: './tabs-grid-wrapper.component.html',
  styleUrls: ['./tabs-grid-wrapper.component.css']
})
export class TabsGridWrapperComponent implements OnInit, AfterViewInit {


  static tabGrid: TabsGridWrapperComponent[] = [];

  exportationDisplay: boolean = false;
  @ViewChild("printingLoader") printingLoader!:PrintingLoaderComponent;
  @ViewChild("tabsBoxContainer") tabsBoxContainer!: ElementRef;
  @ViewChild("exportationContainer") exportationContainer!: PrepareExportationComponent;
  @ViewChild("nestedSection") nestedSection!: ElementRef;
  @ViewChild("nestedPyramidGrid") nestedPyramidGrid!: NestedPyramidGridWrapperComponent;
  //report loader container
  @ViewChild("reportLoader") reportLoader!: ElementRef;

  tabNumber = "tab2";
  loaderMode:boolean = true;

  _displayPyramidGrid: boolean = false;

  // exportationMode:boolean = true;
  loader: boolean = true;

  one: boolean = true;

  constructor(private _ExportExcelService:ExportExcelService , private _ExportWordService:ExportWordService) { }

  ngOnInit(): void {
    TabsGridWrapperComponent.tabGrid.push(this);
  }

  ngAfterViewInit(): void {
    this.printingLoader.changeLoaderAfterTime(false , 3000);
  }

  displayPyramidGrid() {

    setTimeout(() => {
      this._displayPyramidGrid = !this._displayPyramidGrid;
    }, 100)


  }


  testPrint() {
    // this.exportationDisplay = !this.exportationDisplay;

    // PrintingService.sharedValue = "mohamed";

    // const clondeHandsontable = (this.nestedPyramidGrid.handsontableNestedContainer.nativeElement as HTMLElement).cloneNode(true);

    this.exportationContainer.openExportation();

    this.exportationContainer.appendPrintingSectionToContent(this.nestedPyramidGrid.handsontableNestedContainer);

    // this.exportationMode = false;

  }





  onNormalTab() {

    this.printingLoader.changeLoaderImmediately(true);

    this.tabNumber = 'tab1';

    this.printingLoader.changeLoaderAfterTime(false , 1000);


  }

  onPyramidTab() {
    this.printingLoader.changeLoaderImmediately(true);

    this.tabNumber = 'tab2';

    this.printingLoader.changeLoaderAfterTime(false , 1000);
  }


  exportExcel(){

    const handsontablesDataArray = NestedPyramidGridWrapperComponent.nestedTableStatic[0].sourceDataObject;

    this._ExportExcelService.exportNestedPyramidGridToExcel(handsontablesDataArray , "landscape" , "omar abdelmoniem")

  }

  exportWord(){

    const handsontablesDataArray = NestedPyramidGridWrapperComponent.nestedTableStatic[0].sourceDataObject;

    this._ExportWordService.exportNestedGridToWord(handsontablesDataArray , 'landscape');

  }

}

import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
// -import { NgxPrintElementService } from 'ngx-print-element';
import moment from 'moment';
import { NgxPrintElementService } from 'ngx-print-element';
import { TextAreaGridWrapperComponent } from '../../wrappers-grid/textarea-grid-wrapper/textarea-grid-wrapper.component';
import { FixedTableGridWrapperComponent } from '../../wrappers-grid/fixed-table-grid-wrapper/fixed-table-grid-wrapper.component';
import { TableGridWrapperComponent } from '../../wrappers-grid/table-grid-wrapper/table-grid-wrapper.component';
import { ReportGridWrapperComponent } from '../../wrappers-grid/report-grid-wrapper/report-grid-wrapper.component';





@Component({
  selector: 'app-exportation',
  templateUrl: './exportation.component.html',
  styleUrls: ['./exportation.component.css']
})
export class ExportationComponent implements OnInit, OnDestroy {
  @ViewChild("mainExportContainer") mainExportContainer!: ElementRef;
  @ViewChildren("exportDivContent") exportDivContents !: QueryList<any>;
  @ViewChild("containerOfDivs") containerOfDivs !: ElementRef;

  @Input() exportSection!: HTMLDivElement;
  @Input() screenMode: string = "landscape";
  @Input() pageType: string = "A4";
  @Input() operation: string = "pdf";
  @Input() watermarkText: string = "عمر عبدالمنعم عبدالعزيز";


  //varriables
  width: string = "0mm";
  height: string = "0mm";

  //container of divs for printing details varriables
  numberOfPages: number = 1;
  numberOfPagesArray: any[] = [];

  enableWaterMark: boolean = false;

  dateNow!: string;

  static exportationStatic: ExportationComponent[] = [];

  constructor(private _NgxPrintElementService: NgxPrintElementService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {

    //handle date to arabic
    this.dateNow = moment().format('llll'); // Get the formatted date


    //add table to static array
    ExportationComponent.exportationStatic.push(this);

  }

  //handle page number
  calculatePageNumber() {
    const heightOfSection = this.pixelsToMm(Math.ceil(this.exportSection.getBoundingClientRect().height));
    const overHeight: number = 0;

    // if (this.pageType == "A3") {
    //   if (this.screenMode == "landscape") {
    //     this.numberOfPages = Math.ceil(heightOfSection / 297);
    //     this.numberOfPagesArray = Array(this.numberOfPages);
    //     this.width = `420mm`;
    //     this.height = `${297 + overHeight}mm`;
    //   }
    //   else {
    //     this.numberOfPages = Math.ceil(heightOfSection / 420);
    //     this.numberOfPagesArray = Array(this.numberOfPages);
    //     this.width = `297mm`;
    //     this.height = `${420 + overHeight}mm`;
    //   }
    // }

    if (this.pageType == "A4") {
      if (this.screenMode == "landscape") {
        this.numberOfPages = Math.ceil(heightOfSection / 210);
        this.numberOfPagesArray = Array(this.numberOfPages + 10);
        this.width = `297mm`;
        this.height = `${210 + overHeight}mm`;
      }
      else {
        this.numberOfPages = Math.ceil(heightOfSection / 297);
        this.numberOfPagesArray = Array(this.numberOfPages + 10);
        this.width = `210mm`;
        this.height = `${297 + overHeight}mm`;
      }
    }

    // if (this.pageType == "A5") {
    //   if (this.screenMode == "landscape") {
    //     this.numberOfPages = Math.ceil(heightOfSection / 148);
    //     this.numberOfPagesArray = Array(this.numberOfPages);
    //     this.width = `210mm`;
    //     this.height = `${148 + overHeight}mm`;
    //   }
    //   else {
    //     this.numberOfPages = Math.ceil(heightOfSection / 210);
    //     this.numberOfPagesArray = Array(this.numberOfPages);
    //     this.width = `148mm`;
    //     this.height = `${210 + overHeight}mm`;
    //   }
    // }

  }

  //handle exportation content to be compatible with pages
  handleExportaionContentPages() {

    //remove content.
    document.querySelectorAll(".export-div-content").forEach(
      (div: any) => {
        div.innerHTML = ``;
        div.dataset.filled = "empty";
      }

    );

    //report header and footer
    this.handleReportHeaderAndReportFooter();

    if (TextAreaGridWrapperComponent.textStatic.length > 0) {
      //handle report textarea
      this.handleReportTextArea();
    }

    if (FixedTableGridWrapperComponent.fixedTableStatic.length > 0) {
      //handle report fixedtable
      this.handleReportFixedTable();
    }

    if (TableGridWrapperComponent.tableStatic.length > 0) {
      //handle report handsontable
      this.handleReportHandsontable();
    }

    //handle or remove empty divs
    this.handleEmptyDivs();
    //handle number of printing div page
    this.handleFooterPageNumber();

    setTimeout(() => { this.export(); }, 3000)

  }

  @HostListener('window:beforeprint', ['$event'])
  handleBeforePrint(event: Event) {
    if (!this.enableWaterMark) {
      this.mainExportContainer.nativeElement.style.cssText = "display:none !important";
    }
  }

  @HostListener('window:afterprint', ['$event'])
  handleAfterPrint(event: Event) {
    this.mainExportContainer.nativeElement.style.cssText = "display:flex !important";
  }


  export() {
    this.enableWaterMark = true;
    this._NgxPrintElementService.print(this.containerOfDivs).subscribe(() => {
      this.enableWaterMark = false;
    });
  }


  //report header and footer
  handleReportHeaderAndReportFooter() {
    //handle header of report
    const reportHeader = document.getElementById("reportHeaderContainer")?.cloneNode(true) as HTMLElement;
    reportHeader.style.cssText = ` 
    position:absolute; 
    top: 20px;
    left:50%;
    transform:translateX(-50%);   
    border: 1px solid #CCC !important;
    width: 95%;
    margin: 10px auto;
    padding: 10px;
    border-radius: 5px;`
    document.querySelectorAll(".export-div-content")![0].appendChild(reportHeader!);
    document.querySelectorAll(".export-div-content")![0].setAttribute("data-filled", "filled");

    //handle footer of report
    const reportFooter = document.getElementById("reportFooterContainer")?.cloneNode(true) as HTMLElement;
    reportFooter.style.cssText = `
    position:absolute;
    bottom:50px;
    left:50%;
    transform:translateX(-50%);   
    border: 1px solid #CCC !important;
    width: 95%;
    margin: 10px auto;
    padding: 10px;
    border-radius: 5px;`

    const exportDivLenght = document.querySelectorAll(".export-div-content").length;
    document.querySelectorAll(".export-div-content")![exportDivLenght - 1].appendChild(reportFooter!);
    document.querySelectorAll(".export-div-content")![exportDivLenght - 1].setAttribute("data-filled", "filled");
  }

  //handle report textarea
  handleReportTextArea() {
    //get all textArea of gridstack-content
    let gridStackItems_textarea: NodeListOf<HTMLElement> =
      ReportGridWrapperComponent.gridstack_content_element.querySelectorAll(".grid-stack-item-textarea");

    //handle element in page 
    gridStackItems_textarea.forEach((textareaNode: HTMLElement) => {
      const pad = 10;
      const element_left = textareaNode.getBoundingClientRect().x - document.getElementById("reporting-container")?.getBoundingClientRect().x! - pad;
      const element_top = textareaNode.getBoundingClientRect().y - document.getElementById("reporting-container")?.getBoundingClientRect().y! - pad;
      const elementStyle = getComputedStyle(textareaNode);

      //get copy from textArea element
      const cloneElement = textareaNode.cloneNode(true) as HTMLElement;

      //get page details
      const pageDetails = this.getPageDetails(this.pageType, this.screenMode);
      //get textarea top value in mm
      const textareaPositionTopInMM = this.pixelsToMm(element_top);
      //know which page will include this textarea
      const textareaPositionInAnyPage = Math.floor(textareaPositionTopInMM / pageDetails.pageHeight);
      //get position modulas this position is a position top of element in target page.
      const textareaPositionTop = textareaPositionTopInMM % pageDetails.pageHeight;
      //get position modulas this position is a position top of element in target page.
      const textareaPositionLeft = this.pixelsToMm(element_left);

      //set style for cloneElement
      cloneElement.style.cssText =
        `
        position:absolute;
        left: ${textareaPositionLeft}mm;
        top: ${textareaPositionTop}mm;
        color: ${elementStyle.color};
        background-color: ${elementStyle.backgroundColor};
        width: ${elementStyle.width} !important;
        height: ${elementStyle.height} !important;
      
      `


      document.querySelectorAll(".export-div-content")![textareaPositionInAnyPage].appendChild(cloneElement);
      document.querySelectorAll(".export-div-content")![textareaPositionInAnyPage].setAttribute("data-filled", "filled");

    });

  }

  //handle report fixed table
  handleReportFixedTable() {
    //get all textArea of gridstack-content
    let gridStackItems_fixedtable: NodeListOf<HTMLElement> =
      ReportGridWrapperComponent.gridstack_content_element.querySelectorAll(".grid-stack-item-fixedtable");

    //handle element in page 
    gridStackItems_fixedtable.forEach((fixedTableNode: HTMLElement) => {
      const pad = 10;
      const element_left = fixedTableNode.getBoundingClientRect().x - document.getElementById("reporting-container")?.getBoundingClientRect().x! - pad;
      const element_top = fixedTableNode.getBoundingClientRect().y - document.getElementById("reporting-container")?.getBoundingClientRect().y! - pad;
      const elementStyle = getComputedStyle(fixedTableNode);

      //get copy from textArea element
      const cloneElement = fixedTableNode.cloneNode(true) as HTMLElement;

      //get page details
      const pageDetails = this.getPageDetails(this.pageType, this.screenMode);
      //get textarea top value in mm
      const fixedtablePositionTopInMM = this.pixelsToMm(element_top);
      //know which page will include this textarea
      const fixedtablePositionInAnyPage = Math.floor(fixedtablePositionTopInMM / pageDetails.pageHeight);
      //get position modulas this position is a position top of element in target page.
      const fixedtablePositionTop = fixedtablePositionTopInMM % pageDetails.pageHeight;
      //get position modulas this position is a position top of element in target page.
      const fixedtablePositionLeft = this.pixelsToMm(element_left);

      //set style for cloneElement
      cloneElement.style.cssText =
        `
        position:absolute;
        left: ${fixedtablePositionLeft}mm;
        top: ${fixedtablePositionTop}mm;
        width: ${elementStyle.width} !important;
        height: ${elementStyle.height} !important;
      
      `

      document.querySelectorAll(".export-div-content")![fixedtablePositionInAnyPage].appendChild(cloneElement);
      document.querySelectorAll(".export-div-content")![fixedtablePositionInAnyPage].setAttribute("data-filled", "filled");

    });
  }

  //handle report handsontable
  handleReportHandsontable() {

    // let counter: number = 0;
    //get all textArea of gridstack-content
    let handsontables: any =
      document.querySelectorAll(".handsontable-main");

    // handsontables = this.sortHandsontable(handsontables).reverse();

    //get page details
    const pageDetails = this.getPageDetails(this.pageType, this.screenMode);

    //handle element in page 
    handsontables.forEach((handsontableNode: HTMLElement, index: number) => {
      const pad = 10;
      const element_left = handsontableNode.getBoundingClientRect().x - document.getElementById("reporting-container")?.getBoundingClientRect().x! - pad;
      const element_top = handsontableNode.getBoundingClientRect().y - document.getElementById("reporting-container")?.getBoundingClientRect().y! - pad;

      //get textarea top value in mm
      const handsontablePositionTopInMM: number = this.pixelsToMm(element_top);
      //get position modulas this position is a position top of element in target page.
      const handsontablePositionTop: number = handsontablePositionTopInMM % pageDetails.pageHeight;
      //get position modulas this position is a position top of element in target page.
      const handsontablePositionLeft: number = this.pixelsToMm(element_left);
      //know which page will include this handsontable
      let startPage: number = Math.floor(handsontablePositionTopInMM / pageDetails.pageHeight);

      //--------------------------------------------------------------------------------------------

      this.drawHandsontable(handsontableNode, startPage, 0, handsontablePositionTop, handsontablePositionLeft);
      this.handleAggregate(handsontableNode);

    });




  }

  drawHandsontable(handsontableNode: HTMLElement, startPage: number, startRow: number, top: number, left: number) {

    //get clone handsontable
    const cloneHandsontableNode = handsontableNode.cloneNode(true) as HTMLElement;
    //Get HandsontableRows
    const cloneHandsontableRows = Array.from(cloneHandsontableNode.querySelectorAll(".ht_master table.htCore tbody tr")!).slice(startRow);

    cloneHandsontableNode.style.cssText =
      `
        position:absolute;
        left: ${left}mm;
        top: ${top}mm;
      `;

    (cloneHandsontableNode.querySelector(".ht_master .wtHider")! as HTMLElement).style.cssText = `
        height: auto !important;
        width: 100% !important;
        overflow:hidden !important;
      `;


    //Empty Handsontable 
    cloneHandsontableNode.querySelector(".ht_master table.htCore tbody")!.innerHTML = "";

    // //Get All Aggregate 
    cloneHandsontableNode.querySelector(".aggregate-container")?.remove();



    document.querySelectorAll(".export-div-content")![startPage].appendChild(cloneHandsontableNode);
    document.querySelectorAll(".export-div-content")![startPage].setAttribute("data-filled", "filled");

    for (let index = 0; index < cloneHandsontableRows.length; index++) {

      cloneHandsontableNode.querySelector(".ht_master table.htCore tbody")!.appendChild(cloneHandsontableRows[index]);

      const cloneHandsontableHeight = Math.ceil(this.pixelsToMm(cloneHandsontableNode.getBoundingClientRect().height));
      const cloneHandsontableHeightBlusPosition = cloneHandsontableHeight + top;
      if (cloneHandsontableHeightBlusPosition > (this.getPageDetails(this.pageType, this.screenMode).pageHeight)) {
        cloneHandsontableNode.querySelector(".ht_master table.htCore tbody")!.lastElementChild?.remove();

        if (cloneHandsontableNode.querySelector(".ht_master table.htCore tbody")!.querySelectorAll("tr").length == 0) {
          cloneHandsontableNode.remove();
        }

        this.drawHandsontable(handsontableNode, ++startPage, (index + startRow), 0, left);

        break
      }

    }


  }

  handleAggregate(handsontableNode: HTMLElement) {
    const aggregateContainer = handsontableNode.querySelector(".aggregate-container")?.cloneNode(true);
    if (aggregateContainer) {
      const exportDivLenght = document.querySelectorAll(".export-div-content").length;
      document.querySelectorAll(".export-div-content")![exportDivLenght - 1].appendChild(aggregateContainer!);
      document.querySelectorAll(".export-div-content")![exportDivLenght - 1].setAttribute("data-filled", "filled");
    }

  }

  //handle or remove empty divs
  handleEmptyDivs() {
    const emptyDivs: HTMLElement[] = this.containerOfDivs.nativeElement.querySelectorAll("[data-filled='empty']");
    emptyDivs.forEach((emptyDiv) => {

      emptyDiv.closest(".export-div")!.remove();

    });
  }

  //handle number of printing div page
  handleFooterPageNumber() {
    const exportDivs = document.querySelectorAll(".export-div");
    exportDivs.forEach((exportDiv, index) => {

      exportDiv.querySelector(".numberOfAllPage")!.innerHTML = `${exportDivs.length}`;
      exportDiv.querySelector(".numberOfCurrentPage")!.innerHTML = `${index + 1}`;
    });
  }

  //get number of pages need table to draw
  getRequiredNumberOfPagesForElement(element: HTMLElement): number {
    //get height of element.
    const heightOfElement = element.getBoundingClientRect().height;
    //convert height from pixel to mm.
    const heightOfElementInMM = this.pixelsToMm(heightOfElement);
    //divide height of section on height of target page.
    const numberOfRequiredPage = Math.ceil(heightOfElementInMM / this.getPageDetails(this.pageType, this.screenMode).pageHeight);

    console.log(heightOfElementInMM, this.getPageDetails(this.pageType, this.screenMode).pageHeight, this.screenMode);

    return numberOfRequiredPage;
  }

  //get all details about page
  getPageDetails(pageType: string, screenMode: string): { type: string, mode: string, pageHeight: number, pageWidth: number } {

    let pageHeight: number = 0;
    let pageWidth: number = 0;
    const heightOfFooter = 15;

    // if (pageType == "A3") { //if pageType is A3
    //   if (screenMode == "landscape") {
    //     pageWidth = 420;
    //     pageHeight = 297;
    //   }
    //   else {
    //     pageWidth = 297;
    //     pageHeight = 420;
    //   }
    // }


    if (pageType == "A4") { //if pageType is A4
      if (screenMode == "landscape") {
        pageWidth = 297;
        pageHeight = 210 - heightOfFooter;
      }
      else {
        pageWidth = 210;
        pageHeight = 297 - heightOfFooter;
      }
    }


    // if (pageType == "A5") {
    //   if (screenMode == "landscape") {
    //     pageWidth = 210;
    //     pageHeight = 148;
    //   }
    //   else {
    //     pageWidth = 148;
    //     pageHeight = 210;
    //   }
    // }

    //return details
    return { type: pageType, mode: screenMode, pageHeight, pageWidth };

  }


  sortHandsontable(gridStackItems_handsontable: NodeListOf<HTMLElement>) {

    let list_of_handsontable: HTMLElement[] = []
    let gridStackItems = Array.from(gridStackItems_handsontable);

    for (let index = 0; index < gridStackItems_handsontable.length; index++) {

      const item = gridStackItems.filter((handsontable) => {
        const targetTableNumber = parseInt(handsontable.querySelector(".table-number")!.innerHTML);
        return targetTableNumber == (index + 1);
      })[0]


      list_of_handsontable.push(item);
    }

    return list_of_handsontable;
  }


  //convert pixelto mm
  pixelsToMm(pixels: number, dpi: number = 96): number {
    const mmPerInch = 25.4;
    return (pixels * mmPerInch) / dpi;
  }


  ngOnDestroy(): void {
    ExportationComponent.exportationStatic = [];
  }
}

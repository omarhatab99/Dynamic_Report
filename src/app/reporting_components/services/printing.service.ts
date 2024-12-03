import { ElementRef, Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { HelperService } from './helper.service';
import { TableGridWrapperComponent } from '../wrappers-grid/table-grid-wrapper/table-grid-wrapper.component';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PrintingService {

  private sharedSubject = new BehaviorSubject<string | null>(null);
  
  // دالة للحصول على الـ observable
  static sharedValue:string = "omar";

  // دالة لتحديث القيمة
  setSharedValue(newValue: string) {
    this.sharedSubject.next(newValue);
  }

  public sharedMode:string = "default";

  constructor(private _HelperService:HelperService) { }

  handlePaperPrint(section: ElementRef, type: string = "A4", mode: string = "portrait", width: number = 210, height: Number = 297) {
    //handle class
    const paperSize = document.getElementById("paperSizeHandle");
    if (paperSize != null) {
      document.getElementById("paperSizeHandle")?.remove();
    }
    const paperSizeClass = document.createElement('style');
    paperSizeClass.id = "paperSizeHandle";
    paperSizeClass.type = 'text/css';

    // Define the print styles
    paperSizeClass.textContent = `
            @page {
                size: ${type} ${mode} !important;  
                margin: 5mm auto;
            }
      `;

    // Append the style element to the document head
    document.head.appendChild(paperSizeClass);


    //handle size of page
    switch (mode) {
      case "landscape":
        section.nativeElement.style.width = `${height}mm`;
        this.sharedMode = "landscape";
        break;
      case "portrait":
        section.nativeElement.style.width = `${width}mm`;
        this.sharedMode = "portrait";
        break;
      default:
        section.nativeElement.style.width = `100%`;
        this.sharedMode = "default";
        break;
    }

    if (mode != "default") {
      //handle dom
      TableGridWrapperComponent.tableStatic.forEach((component) => {
        component.enable_rowheader_option = false;
        component.enable_editor_option = false;
        component.enable_wordwrap_option = false;
        component.enable_scroll_option = false;

        component.topContainerTable.nativeElement.style.cssText = "display:none !important";
        component.hotTableContainer.nativeElement.style.cssText = "padding-top:0px !important";
        component.hotInstance.updateSettings({ rowHeaders: false, height: "auto" });
        component.hotInstance.render();
      });
    }
    else {
      //handle dom
      TableGridWrapperComponent.tableStatic.forEach((component) => {
        component.enable_rowheader_option = true;
        component.enable_editor_option = true;
        component.enable_wordwrap_option = true;
        component.enable_scroll_option = true;

        if (component.table_editor) {
          component.topContainerTable.nativeElement.style.cssText = "display:block !important";
          component.hotTableContainer.nativeElement.style.cssText = "padding-top:90px !important";
        }

        if (component.table_rowheader) {
          component.hotInstance.updateSettings({ rowHeaders: true });
          component.hotInstance.render();
        }

        if (component.table_height) {
          component.hotInstance.updateSettings({ height: "500px" });
          component.hotInstance.render();
        }

      });
    }


  }

  handlePrintline(printingSection: ElementRef, type: string, mode: string): { numberOfPages: number, pageHeight: number, numberOfPagesArray: any[] } {
    const heightOfPageFooter = 15;
    // const heightOfSection = (+getComputedStyle(printingSection.nativeElement).height.replace("px", "") / 3.78);
    const heightOfSectionNative = printingSection.nativeElement.getBoundingClientRect().height;
    const heightOfSection = this._HelperService.pixelsToMm(Math.ceil(heightOfSectionNative));
    let numberOfPages: number = 0;
    let pageHeight: number = 0;
    let numberOfPagesArray: any[] = [];

    if (type == "A3") {
      switch (mode) {
        case "portrait":
          numberOfPages = Math.ceil((heightOfSection / 420));
          pageHeight = 420;
          break;
        case "landscape":
          numberOfPages = Math.ceil((heightOfSection / 297));
          pageHeight = 297;
          break;
      }

    }

    if (type == "A4") //w:210 , h:297
    {
      switch (mode) {
        case "portrait":
          numberOfPages = Math.ceil((heightOfSection / (297 - heightOfPageFooter)));
          pageHeight = 297 - heightOfPageFooter;
          break;
        case "landscape":
          numberOfPages = Math.ceil((heightOfSection / (210 - heightOfPageFooter)));
          pageHeight = 210 - heightOfPageFooter;
          break;

      }
    }

    if (type == "A5") {
      switch (mode) {
        case "portrait":
          numberOfPages = Math.ceil((heightOfSection / 210));
          pageHeight = 210;
          break;
        case "landscape":
          numberOfPages = Math.ceil((heightOfSection / 148));
          pageHeight = 148;
          break;

      }
    }

    numberOfPagesArray = Array(numberOfPages);
    return { numberOfPages, pageHeight, numberOfPagesArray }
  }

  //export as pdf
  makePdf(element: ElementRef, mode: string) {
    html2canvas(element.nativeElement).then((imageCanvas) => {

      if (mode == "portrait") {

        const imgData = imageCanvas.toDataURL("image/png");
        var imgWidth = 210;
        var pageHeight = 295;
        var imgHeight = imageCanvas.height * imgWidth / imageCanvas.width;
        var heightLeft = imgHeight;

        var doc = new jsPDF("p", 'mm', 'a4');


        var position = 0;

        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        doc.text("username", 50, 50);

        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = (heightLeft - imgHeight);
          doc.addPage();
          doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          doc.setFontSize(30);
          doc.setFont("Helvetica", "bold");
          doc.setTextColor("#0000062");
          doc.text("username", 50, 50);
          heightLeft -= pageHeight;
        }
        doc.save('reporting' + '.pdf')

      }
      else {

        const imgData = imageCanvas.toDataURL("image/png");
        var imgWidth = 295;
        var pageHeight = 210;
        var imgHeight = imageCanvas.height * imgWidth / imageCanvas.width;
        var heightLeft = imgHeight;

        var doc = new jsPDF("l", 'mm', 'a4');

        var position = 0;

        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = (heightLeft - imgHeight)
          doc.addPage();
          doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        doc.save('reporting' + '.pdf')

      }


    })
  }


  makePrintAndPdfContainer(section:ElementRef , operation:string): void {


    
  }


}

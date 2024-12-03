import { AfterViewInit, Component, ElementRef, OnInit, Type, ViewChild } from '@angular/core';
import { NgxPrintElementService } from 'ngx-print-element';
import { PORIENTATION, PrintSettingsV2 } from '../../models/print-settings-v2';
import { PrintingLoaderComponent } from '../printing-loader/printing-loader.component';

@Component({
  selector: 'app-prepare-exportation',
  templateUrl: './prepare-exportation.component.html',
  styleUrls: ['./prepare-exportation.component.css']
})
export class PrepareExportationComponent implements OnInit, AfterViewInit {

  //viewchild.
  @ViewChild("exportationPlaceholder") exportationPlaceholder!: ElementRef;
  @ViewChild("exportationPlaceholderContent") exportationPlaceholderContent!: ElementRef;
  @ViewChild("placeholderContent") placeholderContent!: ElementRef;
  @ViewChild("printingLoader") printingLoader!: PrintingLoaderComponent;

  //varriables
  displayExportation:boolean = true;
  loaderMode: boolean = false;

  //exportation configurations.
  printSettings: PrintSettingsV2 = new PrintSettingsV2();

  //properties
  get selectScreenMode() {
    return this.printSettings.printingOrientaion;
  }

  set selectScreenMode(value: any) {
    //get printing orientation.
    this.printSettings.printingOrientaion = parseInt(value);

    //change size of printing page.
    if (this.printSettings.printingOrientaion == PORIENTATION.LANDSCAPE) {

      //start printing loader 
      this.printingLoader.changeLoaderImmediately(true);

      this.printSettings.pageWidth = '297mm';
      this.printSettings.pageHeight = '210mm';

      //reassign row width of nested handsontable
      // this.handleHandsontableScreenMode("landscape");

      //stop printing loader
      this.printingLoader.changeLoaderAfterTime(false, 1000);

    }
    else {

      //start printing loader 
      this.printingLoader.changeLoaderImmediately(true);

      this.printSettings.pageWidth = '210mm';
      this.printSettings.pageHeight = '297mm';

      //reassign row width of nested handsontable
      // this.handleHandsontableScreenMode("portrait");

      //stop printing loader
      this.printingLoader.changeLoaderAfterTime(false, 1000);

    }

  }

  constructor(private _NgxPrintElementService: NgxPrintElementService) { }

  ngOnInit(): void {



  }

  ngAfterViewInit(): void {

    //scroll to top of component.
    window.scrollTo({ top: 0, left: 0 });

    //append printing section to content.
    // this.appendPrintingSectionToContent();

    //stop loader after 5 seconds.
    // this.printingLoader.changeLoaderAfterTime(false, 5000);
  }


  startPrinting = () =>
    this._NgxPrintElementService.print(this.exportationPlaceholderContent);


  handleHandsontableScreenMode(screenMode: string) {

    const hasNestedHandsontable =
      this.exportationPlaceholderContent.nativeElement.querySelector(".placeholder-content .nested-handsontable.inner-handsontable")

    //check if has nestedHandsontable in container of printing
    if (hasNestedHandsontable) {

      if (screenMode == "landscape") { //printing mode is landscape.
        this.exportationPlaceholderContent.nativeElement.querySelectorAll(".placeholder-content .nested-handsontable.inner-handsontable")
          .forEach((nestedhandsontable: HTMLElement) => {
            nestedhandsontable.style.cssText = `width:1103px`;
          })
      }
      else //printing mode is portrait.
      {
        this.exportationPlaceholderContent.nativeElement.querySelectorAll(".placeholder-content .nested-handsontable.inner-handsontable")
          .forEach((nestedhandsontable: HTMLElement) => {
            nestedhandsontable.style.cssText = `width:774px`;
          })
      }

    }



  }


  appendPrintingSectionToContent(element: HTMLElement | Node | ElementRef | undefined = undefined) {


    //start printing loader 
    this.printingLoader.changeLoaderImmediately(true);

    //assign element to printing section.
    if (element != undefined)
    {
      this.printSettings.printingSection = element;
    }
    //checking...using instanceOf.

    console.log(this.printSettings.printingSection);

    if (this.printSettings.printingSection == undefined) {
      console.log("UNDEFINED");
    }

    if (this.printSettings.printingSection instanceof HTMLElement) {
      this.placeholderContent.nativeElement.appendChild(this.printSettings.printingSection);
    }

    if (this.printSettings.printingSection instanceof Node) {
      this.placeholderContent.nativeElement.appendChild(this.printSettings.printingSection);
    }

    if (this.printSettings.printingSection instanceof ElementRef) {
      // this.printSettings.printingSection.nativeElement.style.cssText = "width:1103px";
      const handsontable = this.printSettings.printingSection.nativeElement as HTMLElement;
      // handsontable.style.cssText = "width:773px";
      setTimeout(() => {
        
        const clondeHandsontable = handsontable.cloneNode(true) as HTMLElement;
        this.placeholderContent.nativeElement.appendChild(clondeHandsontable);

        // handsontable.style.cssText = "width:1103px";


      } , 1500)

    }


    //stop printing loader
    this.printingLoader.changeLoaderAfterTime(false, 100);

  }


  openExportation(){

    this.displayExportation = false;

  }


  closeExportation() {

    this.placeholderContent.nativeElement.innerHTML = "";

    this.displayExportation = true;

  }



  // getWidthOfParentRow():{rowWidth:number , rowHeight:number}{
  //   const clientWidth = (this.exportationPlaceholderContent.nativeElement.querySelector(".parent-row") as HTMLElement).clientWidth;
  //   const clientHeight = (this.exportationPlaceholderContent.nativeElement.querySelector(".parent-row") as HTMLElement).clientHeight;

  //   return {rowWidth:clientWidth , rowHeight:clientHeight};
  // }


}

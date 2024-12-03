import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { WidgetWrapperService } from '../../services/widget-wrapper.service';
import { Helper } from '../../constants/helper';
import { ReportGridWrapperComponent } from '../report-grid-wrapper/report-grid-wrapper.component';


export enum TEXTTYPE {
  "TITLE",
  "Large",
  "Medium",
  "small",
  "NORMAL",
}


@Component({
  selector: 'app-textarea-grid-wrapper',
  templateUrl: './textarea-grid-wrapper.component.html',
  styleUrls: ['./textarea-grid-wrapper.component.css']
})
export class TextAreaGridWrapperComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild("textArea") textArea!:ElementRef; 
  //component id
  id: string = "";
  //component static array.
  static textStatic: TextAreaGridWrapperComponent[] = [];

  //textArea Allowance Configuration
  @Input() allowMoving:boolean = true;
  @Input() allowEditing:boolean = true;
  @Input() allowDeleting:boolean = true;
  
  //configuration
  @Input() grid_id: string | undefined = "none";
  @Input() grid_content: string | undefined = "لا يوجد";
  @Input() grid_x: number | undefined = 0;
  @Input() grid_y: number | undefined = 0;
  @Input() grid_w: number | undefined = 1;
  @Input() type: TEXTTYPE | undefined = TEXTTYPE.NORMAL;

  showDialogText: boolean = false;
  value: string = "";


  //configuration of angular editor
  editorConfig!: AngularEditorConfig;

  constructor(private _WidgetWrapperService: WidgetWrapperService) { }


  ngOnChanges(changes: SimpleChanges): void {

  }

  //component intialize
  ngOnInit(): void {

    //intialize component id
    this.id = this.getRandomId();

    //add component to array
    TextAreaGridWrapperComponent.textStatic.push(this);

    //angular editor config
    this.editorConfig = Helper.editorConfig;
  }

  //after view init
  ngAfterViewInit(): void {
    //update gridstack widget
    this.handleGridWidgetUpdateWithOptions();

    setTimeout(() => {
      this.handleGridWidgetUpdateWithOptions();
    } , 1500)
  }

  //for update widget
  handleGridWidgetUpdateWithOptions() {
    setTimeout(() => {
      const GridStackWidget = { id: this.grid_id, w: this.grid_w, h: 1, x: this.grid_x, y: this.grid_y, sizeToContent: true };
      this._WidgetWrapperService.updateGridWidget(ReportGridWrapperComponent.gridstack_content, this.grid_id, GridStackWidget);
    }, 50);
  }


  //update all widget when blur
  textAreaBlur() {
    this._WidgetWrapperService.updateAllWidgetDynamically(ReportGridWrapperComponent.gridstack_content);
  }

  //textbox functions
  showTextDialog() {
    const widget = this._WidgetWrapperService.getWidgetById(ReportGridWrapperComponent.gridstack_content, this.grid_id!) as HTMLElement;
    const value = widget.querySelector(".text-editable")?.innerHTML;


    if (widget) {
      this.value = value!;
      this.showDialogText = true;
    }
  }


  //save textBox
  saveTextBox() {
    if (this.value != "") {
      const widget = this._WidgetWrapperService.getWidgetById(ReportGridWrapperComponent.gridstack_content, this.grid_id!) as HTMLElement;
      if (widget) {
        widget.querySelector(".text-editable")!.innerHTML = this.value;
        ReportGridWrapperComponent.gridstack_content.removeWidget(widget);
        ReportGridWrapperComponent.gridstack_content.addWidget(widget, {});
        this.closeTextDialog();
      }
    }
  }

  //close dialog
  closeTextDialog() {
    this.showDialogText = false;
    this.value = "";
  }

  //remove widget
  removeWidget(){
    this._WidgetWrapperService.removeWidget(ReportGridWrapperComponent.gridstack_content , this.grid_id!).then((response) => {
      if(response){
        const textAreaIndex = TextAreaGridWrapperComponent.textStatic.findIndex((compnent) => compnent == this);
        TextAreaGridWrapperComponent.textStatic.splice(textAreaIndex, 1);
      }
    });
  }

  handleLongText(){
    const textAreaRect = this.textArea.nativeElement.getBoundingClientRect();
    const textAreaStyle = getComputedStyle(this.textArea.nativeElement);
    const textFontSize = textAreaStyle.fontSize;
    const textFontFamily = textAreaStyle.fontFamily;
    const textAreafont = `${textFontSize} ${textFontFamily}`;

    const childNodes:ChildNode[] = this.textArea.nativeElement.childNodes;
    if(childNodes.length == 1 && childNodes[0].nodeType == Node.TEXT_NODE){

      const lines = this.getLinesForParagraph(this.grid_content! , textAreaRect.width , textAreafont);
  
      let cartonaOfParagraphs:string = "";
  
      lines.forEach((line) => {
  
        const paragraph = `<p class="handle-text m-0 p-0"> ${line} </p>`;
        cartonaOfParagraphs += paragraph;
  
  
      });
  
      this.textArea.nativeElement.innerHTML = cartonaOfParagraphs;
    }
  }

  removeHandleLongText(){
    let cartonaOfText:string = "";
    const handleTexts = this.textArea.nativeElement.querySelectorAll(".handle-text");
    if(handleTexts.length > 0){
      handleTexts.forEach((text:any) => {
        cartonaOfText += " " + text.innerText;
      });
  
      this.textArea.nativeElement.innerHTML = cartonaOfText;
    }


  }

  getLinesForParagraph(text: string, containerWidth: number, font: string): string[] {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return [];

    context.font = font;
    const words = text.split(' ');
    let line = '';
    const lines: string[] = [];

    words.forEach((word) => {
      const testLine = line + word + ' ';
      const testWidth = context.measureText(testLine).width;
      if (testWidth > containerWidth && line.length > 0) {
        lines.push(line.trim());
        line = word + ' ';
      } else {
        line = testLine;
      }
    });

    // Add the last line
    lines.push(line.trim());

    return lines;
  }

  //get random id
  getRandomId(): string {
    const random = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    return `text-${random}`;
  }
}

import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { WidgetWrapperService } from '../../services/widget-wrapper.service';
import { ReportGridWrapperComponent } from '../report-grid-wrapper/report-grid-wrapper.component';

@Component({
  selector: 'app-image-grid-wrapper',
  templateUrl: './image-grid-wrapper.component.html',
  styleUrls: ['./image-grid-wrapper.component.css']
})
export class ImageGridWrapperComponent implements OnInit, AfterViewInit {

  //image
  @ViewChild("image") image!: ElementRef;
  @ViewChild("imagePreview") imagePreview!: ElementRef;

  //component id
  id: string = "";

  //component static array.
  static imagesStatic: ImageGridWrapperComponent[] = [];

  //textArea Allowance Configuration
  @Input() allowMoving: boolean = true;
  @Input() allowEditing: boolean = true;
  @Input() allowDeleting: boolean = true;

  //configuration
  @Input() grid_id: string | undefined = "none";
  @Input() grid_x: number | undefined = 0;
  @Input() grid_y: number | undefined = 0;
  @Input() grid_w: number | undefined = 1;
  @Input() url: string | undefined = "../../../assets/placeholder_image.png";


  //image
  showDialogImage: boolean = false;
  imageUrl: string = "../../../assets/placeholder_image.png";
  imageUploaded: boolean = false;

  constructor(private _WidgetWrapperService: WidgetWrapperService, private _ToastrService: ToastrService) { }


  ngOnInit(): void {
    //intialize component id
    this.id = this.getRandomId();

    //add component to array
    ImageGridWrapperComponent.imagesStatic.push(this);;
  }



  ngAfterViewInit(): void {
    //update gridstack widget
    this.handleGridWidgetUpdateWithOptions();
  }

  //for update widget
  handleGridWidgetUpdateWithOptions() {
    setTimeout(() => {
      const GridStackWidget = { id: this.grid_id, w: this.grid_w, h: 1, x: this.grid_x, y: this.grid_y, sizeToContent: true };
      this._WidgetWrapperService.updateGridWidget(ReportGridWrapperComponent.gridstack_content, this.grid_id, GridStackWidget);
    }, 50);
  }

  showImageDialog() {
    this.imagePreview.nativeElement.src = this.image.nativeElement.src;
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
      //update widget
      const widget = this._WidgetWrapperService.getWidgetById(ReportGridWrapperComponent.gridstack_content, this.grid_id!) as HTMLElement;
      if (widget) {

        const widgetImage = widget.querySelector(".report-image-dynamic")! as HTMLImageElement;
        widgetImage.src = this.imageUrl;

        ReportGridWrapperComponent.gridstack_content.removeWidget(widget);
        ReportGridWrapperComponent.gridstack_content.addWidget(widget, {});

        this.closeImageDialog();

      }
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

  //remove widget
  removeWidget() {
    this._WidgetWrapperService.removeWidget(ReportGridWrapperComponent.gridstack_content, this.grid_id!).then((response) => {
      if (response) {
        const imageIndex = ImageGridWrapperComponent.imagesStatic.findIndex((compnent) => compnent == this);
        ImageGridWrapperComponent.imagesStatic.splice(imageIndex, 1);
      }
    })
  }


  //get random id
  getRandomId(): string {
    const random = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    return `image-${random}`;
  }

}



import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { ReportGridWrapperComponent } from '../report-grid-wrapper/report-grid-wrapper.component';
import { WidgetWrapperService } from '../../services/widget-wrapper.service';

@Component({
  selector: 'app-fixed-table-grid-wrapper',
  templateUrl: './fixed-table-grid-wrapper.component.html',
  styleUrls: ['./fixed-table-grid-wrapper.component.css']
})
export class FixedTableGridWrapperComponent implements OnInit, AfterViewInit {

  //component id
  id: string = "";

  //component static array.
  static fixedTableStatic: FixedTableGridWrapperComponent[] = [];

  //Fixedtable Allowance Configuration
  @Input() allowMoving: boolean = true;
  @Input() allowEditing: boolean = true;
  @Input() allowDeleting: boolean = true;

  //data configurations
  @Input() rows: any[] = [];
  @Input() itemSource: any[] = [];


  //configuration
  @Input() grid_id: string | undefined = "none";
  @Input() grid_x: number | undefined = 0;
  @Input() grid_y: number | undefined = 0;
  @Input() grid_w: number | undefined = 1;

  constructor(private _WidgetWrapperService: WidgetWrapperService) { }

  ngOnInit(): void {

    //intialize component id
    this.id = this.getRandomId();

    //add component to array
    FixedTableGridWrapperComponent.fixedTableStatic.push(this);

  }

  ngAfterViewInit(): void {
    //update gridstack widget
    this.handleGridWidgetUpdateWithOptions();

    setTimeout(() => {
      this.handleGridWidgetUpdateWithOptions();
    }, 1500);
  }

  //for update widget
  handleGridWidgetUpdateWithOptions() {
    setTimeout(() => {
      const GridStackWidget = { id: this.grid_id, w: this.grid_w, h: 1, x: this.grid_x, y: this.grid_y, sizeToContent: true };
      this._WidgetWrapperService.updateGridWidget(ReportGridWrapperComponent.gridstack_content, this.grid_id, GridStackWidget);
    }, 50);
  }


  //update all widget when blur
  fixedTableBlur() {
    this._WidgetWrapperService.updateAllWidgetDynamically(ReportGridWrapperComponent.gridstack_content);
  }

  //remove widget
  removeWidget() {
    this._WidgetWrapperService.removeWidget(ReportGridWrapperComponent.gridstack_content, this.grid_id!).then((response) => {
      if (response) {
        const ftableIndex = FixedTableGridWrapperComponent.fixedTableStatic.findIndex((compnent) => compnent == this);
        FixedTableGridWrapperComponent.fixedTableStatic.splice(ftableIndex, 1);
      }
    });
  }

  //get random id
  getRandomId(): string {
    const random = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    return `ftable-${random}`;
  }

}

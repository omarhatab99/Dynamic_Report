import { Component, ElementRef , OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TableGridWrapperComponent } from '../../wrappers-grid/table-grid-wrapper/table-grid-wrapper.component';
import { WidgetWrapperService } from '../../services/widget-wrapper.service';
import Swal from 'sweetalert2';


export enum operationsFunction {
  SUMMITION,
  AVERAGE,
  COUNT
};

export enum operationsFunctionV2 {
  SUMMITION,
  AVERAGE,
  COUNT,
  BIGGEST,
  SMALLEST
};

@Component({
  selector: 'app-function',
  templateUrl: './function.component.html',
  styleUrls: ['./function.component.css'],
  providers: [DatePipe]
})
export class FunctionComponent implements OnInit , OnDestroy {
  //select elements from dom
  @ViewChild('functionElement') functionElement!: ElementRef;
  @ViewChild('functionCollabse') functionCollabse!: ElementRef;

  itemSource_data: any[] = [];
  //get selected columns from table
  itemSource_options: any[] = [];

  //used for selected function (event)
  _selectedFunction: any[] = [];
  //used for filter selected column (event)
  _filterSelectedColumn: any;

  //used to show filter operation 
  filterOperationShow: boolean = false;

  //random function id
  functionId: any;

  //options
  operations: any[] = [];

  static functionStatic:FunctionComponent[] = [];

  constructor(private _TableGridWrapperComponent: TableGridWrapperComponent , private _WidgetWrapperService: WidgetWrapperService) { }


  ngOnInit(): void {

    FunctionComponent.functionStatic.push(this);

    //defaults values
    this.functionId = this.getRandomId();

    this.itemSource_data = this._TableGridWrapperComponent.itemSource_data;

    //handle selected column to sure it is number
    this.itemSource_options = this._TableGridWrapperComponent.itemSource_cols.map((element) => {
      return { label: element, value: element }
    }).filter((element: any) => {
      if (!Number.isNaN(parseFloat(this.itemSource_data[0][element.value]))) {
        return element;
      }
    });



    //when table is filtered
    if (this.selectedfunction.length != 0) {
      const functions = this.prepareFunctions(this.selectedfunction, this.filterSelectedColumn);
      const functionIndex = this._TableGridWrapperComponent.functionSelected.findIndex((func) => func.id == functions.id);
      if (functionIndex == -1) {
        this._TableGridWrapperComponent.functionSelected.push(functions);
      }
      else {
        this._TableGridWrapperComponent.functionSelected[functionIndex] = functions;
      }
    };

    //setup options
    this.setupOptionsForCompoBoxAndMultiSelect();
  }


  setupOptionsForCompoBoxAndMultiSelect() {
    const headerOption = { label: "اختر عامود", value: null };
    this.itemSource_options.unshift(headerOption);

    //handle operations
    this.operations = [
      { label: 'المجموع', value: { name: 'المجموع', function: operationsFunctionV2.SUMMITION } },
      { label: 'المعدل', value: { name: 'المعدل', function: operationsFunctionV2.AVERAGE } },
      { label: 'الاكبر', value: { name: 'الاكبر', function: operationsFunctionV2.BIGGEST } },
      { label: 'الاصغر', value: { name: 'الاصغر', function: operationsFunctionV2.SMALLEST } },

    ];
  }



  get filterSelectedColumn(): any {
    return this._filterSelectedColumn;
  }

  set filterSelectedColumn(val: any) {
    this.filterOperationShow = (val) ? true : false;
    this._filterSelectedColumn = val;

    if (this.selectedfunction.length != 0) {
      const functions = this.prepareFunctions(this.selectedfunction, this.filterSelectedColumn);
      const functionIndex = this._TableGridWrapperComponent.functionSelected.findIndex((func) => func.id == functions.id);
      if (functionIndex == -1) {
        this._TableGridWrapperComponent.functionSelected.push(functions);
      }
      else {
        this._TableGridWrapperComponent.functionSelected[functionIndex] = functions;
      }
    }
  }

  get selectedfunction(): any {
    return this._selectedFunction;
  }

  set selectedfunction(val: any) {
    //restore original order
    this._selectedFunction = val;
    const functions = this.prepareFunctions(val, this.filterSelectedColumn);
    const functionIndex = this._TableGridWrapperComponent.functionSelected.findIndex((func) => func.id == functions.id);
    if (functionIndex == -1) {
      this._TableGridWrapperComponent.functionSelected.push(functions);
    }
    else {
      this._TableGridWrapperComponent.functionSelected[functionIndex] = functions;
    }

    //update gridstack_down
    // this._WidgetWrapperService.updateAllWidgetDynamically(ReportGridWrapperComponent.gridstack_tables);
  }

  //delete function
  confirmationDeleteFunction() {
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
        try {
          //Actual logic to perform a confirmation
          const functionIndex = this._TableGridWrapperComponent.functionSelected.findIndex((func) => func.id == this.functionId);
          if (functionIndex != -1) {
            this._TableGridWrapperComponent.functionSelected.splice(functionIndex, 1);
          }
          this.functionElement.nativeElement.remove();
          this.functionCollabse.nativeElement.remove();
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
            icon: "error"
          });
        }

      }
    });

  }


  //function operations
  summation(columnName: string): number {
    const columnData: any[] = [];
    this.itemSource_data.forEach((element) => {
      if (!Number.isNaN(parseFloat(element[columnName]))) { columnData.push(element[columnName]); }
    });
    const summition = columnData.reduce((current, accumalator) => parseFloat(current) + parseFloat(accumalator));
    return summition;

  }

  average(columnName: string): number {
    return this.summation(columnName) / this._TableGridWrapperComponent.itemSource_data.length;
  }

  biggest(columnName: string): number {
    const columnData: any[] = [];
    this._TableGridWrapperComponent.itemSource_data.forEach((element) => {
      if (!Number.isNaN(parseFloat(element[columnName]))) { columnData.push(element[columnName]); }
    });

    return Math.max(...columnData);

  }

  smallest(columnName: string): number {
    const columnData: any[] = [];
    this._TableGridWrapperComponent.itemSource_data.forEach((element) => {
      if (!Number.isNaN(parseFloat(element[columnName]))) { columnData.push(element[columnName]); }
    });
    return Math.min(...columnData);
  }



  prepareFunctions(values: any[], column: any): any {
    const columnFunctionsPrepare: any[] = [];
    const hasSumFunction = values.some((element) => element.function == operationsFunctionV2.SUMMITION);
    hasSumFunction ? columnFunctionsPrepare.push({ label: "المجموع", value: this.summation(column) }) : columnFunctionsPrepare.push({ label: "المجموع", value: "" });
    const hasAverageFunction = values.some((element) => element.function == operationsFunctionV2.AVERAGE);
    hasAverageFunction ? columnFunctionsPrepare.push({ label: "المعدل", value: this.average(column) }) : columnFunctionsPrepare.push({ label: "المعدل", value: "" });
    const hasBiggestFunction = values.some((element) => element.function == operationsFunctionV2.BIGGEST);
    hasBiggestFunction ? columnFunctionsPrepare.push({ label: "اكبر قيمه", value: this.biggest(column) }) : columnFunctionsPrepare.push({ label: "اكبر قيمه", value: "" });
    const hasSmallestFunction = values.some((element) => element.function == operationsFunctionV2.SMALLEST);
    hasSmallestFunction ? columnFunctionsPrepare.push({ label: "اصغر قيمه", value: this.smallest(column) }) : columnFunctionsPrepare.push({ label: "اصغر قيمه", value: "" });

    return { id: this.functionId, column, functions: columnFunctionsPrepare };
  }


  getRandomId(): string {
    const random = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    return `function-${random}`;
  }


  ngOnDestroy(): void {
    FunctionComponent.functionStatic = [];
  }
}


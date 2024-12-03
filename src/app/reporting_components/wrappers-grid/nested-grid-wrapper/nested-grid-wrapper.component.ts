import { AfterViewInit, Component, ComponentFactoryResolver, Input, OnDestroy, OnInit, Renderer2, ViewContainerRef } from '@angular/core';
import { ContextMenu } from 'handsontable/plugins/contextMenu';
import { HandsontableSettings } from '../../models/handsontable-settings';
import { PrintSettings } from '../../models/print-settings';
import { ExportSettings } from '../../models/export-settings';


@Component({
  selector: 'app-nested-grid-wrapper',
  templateUrl: './nested-grid-wrapper.component.html',
  styleUrls: ['./nested-grid-wrapper.component.css']
})
export class NestedGridWrapperComponent implements OnInit, AfterViewInit, OnDestroy {

  //statics
  static nestedTableStatic: NestedGridWrapperComponent[] = [];

  //grid allowance configurations
  @Input() trimDropdown: boolean = false;
  @Input() filters: boolean = true;
  @Input() dropdownMenu: boolean = true;
  @Input() multiColumnSorting: boolean = true;
  @Input() manualRowMove: boolean = true;
  @Input() manualColumnMove: boolean = true;
  @Input() autoWrapRow: boolean = true;
  @Input() autoWrapCol: boolean = true;
  @Input() readonly: boolean = false;
  @Input() manualColumnResize: boolean = true;
  @Input() manualColumnFreeze: boolean = true;
  @Input() mergeCells: boolean = true;
  @Input() wordWrap: boolean = true;
  @Input() dragToScroll: boolean = true;
  @Input() contextMenu: boolean = true;
  @Input() hasToolbarAndHyperFormula: boolean = true;
  @Input() showAddFunction: boolean = true;
  @Input() showRowHeader: boolean = true;
  @Input() showAdvancedEditor: boolean = true;
  @Input() showWordWrap: boolean = true;
  @Input() showScroll: boolean = true;
  @Input() showSelectedCols: boolean = true;
  @Input() allowDeleting: boolean = true;
  @Input() collapseAll: boolean = true;
  @Input() showHandsontableConfiguration: boolean = true;
  @Input() hasPyramidGrid: boolean = true;


  //gridSettings
  handsontableSettings: HandsontableSettings = new HandsontableSettings(this.getRandomId());

  //gridSettings varriables
  _nestedOptionsDialogDisplay: boolean = false;
  _displayPyramidGrid: boolean = false;

  //gridSettings options
  table_state: boolean = false; // default collapsed
  loader: boolean = true;



  //context menu items object
  contextMenuItems: any = {

    items: {
      'row_above': {},
      'row_below': {},
      'separator2': ContextMenu.SEPARATOR,
      'remove_row': {},
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

    }

  };

  dropdownItems: any = {
    items: ['filter_action_bar', 'filter_by_condition', 'filter_by_condition2']
  };


  sourceDataObject: any[] = [
    {
      isParent: true, isExpanded: false, "الموازنه": "القسم الثانى: الهيئات الاقتصاديه", القيمه: '552', children: [
        {
          isParent: true, isExpanded: false, "التبعيه": "الهيئات الاقتصاديه", القيمه: '552', children: [
            { isParent: false, isExpanded: false, "جه-الاسناد-الرئيسيه": "وزارة الزراعه واستصلاح الاراضى", القيمه: '100', children: [] },
            { isParent: false, isExpanded: false, "جه-الاسناد-الرئيسيه": "وزارة الموارد المائيه والرى ", القيمه: '20', children: [] },
            {
              isParent: true, isExpanded: false, "جه-الاسناد-الرئيسيه": "وزارة التجارة والصناعه", القيمه: '30', children: [
                { isParent: false, isExpanded: false, "جه-الاسناد-الرئيسيه": "وزارة الزراعه واستصلاح الاراضى", القيمه: '100', children: [] },
                { isParent: false, isExpanded: false, "جه-الاسناد-الرئيسيه": "وزارة الموارد المائيه والرى ", القيمه: '20', children: [] },
              ]
            },
            { isParent: false, isExpanded: false, "جه-الاسناد-الرئيسيه": "وزارة البترول", القيمه: '100', children: [] },
            { isParent: false, isExpanded: false, "جه-الاسناد-الرئيسيه": "وزارة الكهرباء والطاقه المتحددة", القيمه: '60', children: [] },
            { isParent: false, isExpanded: false, "جه-الاسناد-الرئيسيه": "وزارة النقل", القيمه: '100', children: [] },
            { isParent: false, isExpanded: false, "جه-الاسناد-الرئيسيه": "وزارة الاتصالات وتكنولوجيا المعلومات", القيمه: '70', children: [] },
          ]
        }
      ]
    },
    { isParent: true, isExpanded: false, الموازنه: "القسم الاول: الحكومه- الجهاز الادارى - الادارة المحليه - الخدمات المحليه", القيمه: '10574', children: [] },
    { isParent: true, isExpanded: false, الموازنه: "القسم الثالث: الوحدات الاقتصاديه غير المعامله بالقاون رقم 903", القيمه: '5145', children: [] },
    { isParent: true, isExpanded: false, الموازنه: "القسم الرابع: موازنات خاصه ", القيمه: '1', children: [] },
    {
      isParent: true, isExpanded: false, "الموازنه": "القسم الثانى: الهيئات الاقتصاديه", القيمه: '552', children: [
        {
          isParent: true, isExpanded: false, "التبعيه": "الهيئات الاقتصاديه", القيمه: '552', children: [
            { isParent: false, isExpanded: false, "جه-الاسناد-الرئيسيه": "وزارة الزراعه واستصلاح الاراضى", القيمه: '100', children: [] },
            { isParent: false, isExpanded: false, "جه-الاسناد-الرئيسيه": "وزارة الموارد المائيه والرى ", القيمه: '20', children: [] },
            {
              isParent: true, isExpanded: false, "جه-الاسناد-الرئيسيه": "وزارة التجارة والصناعه", القيمه: '30', children: [
                { isParent: false, isExpanded: false, "جه-الاسناد-الرئيسيه": "وزارة الزراعه واستصلاح الاراضى", القيمه: '100', children: [] },
                { isParent: false, isExpanded: false, "جه-الاسناد-الرئيسيه": "وزارة الموارد المائيه والرى ", القيمه: '20', children: [] },
              ]
            },
            { isParent: false, isExpanded: false, "جه-الاسناد-الرئيسيه": "وزارة البترول", القيمه: '100', children: [] },
            { isParent: false, isExpanded: false, "جه-الاسناد-الرئيسيه": "وزارة الكهرباء والطاقه المتحددة", القيمه: '60', children: [] },
            { isParent: false, isExpanded: false, "جه-الاسناد-الرئيسيه": "وزارة النقل", القيمه: '100', children: [] },
            { isParent: false, isExpanded: false, "جه-الاسناد-الرئيسيه": "وزارة الاتصالات وتكنولوجيا المعلومات", القيمه: '70', children: [] },
          ]
        }
      ]
    },
  ];


  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) { }

  ngOnInit(): void {

    //add table to static array
    NestedGridWrapperComponent.nestedTableStatic.push(this);


    //handle handsontable data 
    this.handsontableSettings.rowHeader = Object.keys(this.sourceDataObject[0]);

    this.handsontableSettings.itemSource = this.sourceDataObject.map((element) => {
      return Object.values(element);
    });

    //handle handsontable settings
    this.handleGridSettings();

  }

  ngAfterViewInit(): void {
    //intialize handsontable.
    this.handsontableSettings.intializeHandsontable();
  }


  //create dynamic nested handsontable.
  createDynamicNestedHandsontable(row: number, rowElement: HTMLElement, data: any) {

    //create handsontable breaker.
    const handsontableBreaker: HTMLElement = document.createElement("br");
    //create nestedHandsontableContainer div.
    const handsontableContainer: HTMLElement = document.createElement('div');
    //add class nested-handsontable to handsontableContainer.
    handsontableContainer.className = "nested-handsontable";
    //set width to handsontableContainer.
    handsontableContainer.style.width = `${rowElement.clientWidth}px`;
    //stop propagation of parent
    handsontableContainer.addEventListener('mousedown', (event) => {
      event.stopPropagation();
    });


    //append dynamic component.
    this.renderer.appendChild(this.viewContainerRef.element.nativeElement, handsontableContainer);
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(NestedGridWrapperComponent);
    const componentRef = this.viewContainerRef.createComponent(componentFactory);

    //reassign component configurations.
    componentRef.instance.showHandsontableConfiguration = false;
    componentRef.instance.hasPyramidGrid = false;

    //assign nested children to new component.
    componentRef.instance.sourceDataObject = data;

    //append component ref to handsontableContainer.
    this.renderer.appendChild(handsontableContainer, componentRef.location.nativeElement);
    this.renderer.appendChild(rowElement, handsontableBreaker);
    this.renderer.appendChild(rowElement, handsontableContainer);

    //render handsontable
    this.renderAllHandsontable();


  }

  handleAllNestedInIntializationOfHandsontable() {



  }

  //this function handle grid settings
  handleGridSettings() {
    this.handsontableSettings.hotSettings = {
      layoutDirection: 'rtl',
      width: '100%',
      height: 'auto',
      stretchH: "all",
      rowHeights: 30,
      className: 'htCenter',
      dropdownMenu: this.dropdownItems,
      dragToScroll: false,
      trimDropdown: false,
      filters: true,
      multiColumnSorting: true,
      manualRowMove: true,
      manualColumnMove: true,
      autoWrapRow: true,
      autoWrapCol: true,
      readOnly: false,
      manualColumnResize: false,
      wordWrap: true,
      disableVisualSelection: false,
      rowHeaders: true,
      rowHeaderWidth: 50,
      hiddenColumns: {
        indicators: true,
        columns: [0, 1, this.handsontableSettings.rowHeader.length - 1], // Hiding the first column (index 0)
      },
      contextMenu: this.contextMenuItems,

      afterRenderer: (TD, row, column, prop, value, cellProperties) => {
        //get row elmenet.
        const rowElement = TD.closest("tr")!;

        //check parent row
        const isParent: boolean = this.handsontableSettings.hotInstance?.getData()[row][0];

        if (isParent) {

          //set class parent-row to tr.
          rowElement.classList.add("parent-row");

          //check if row is expanded
          const isExpanded: boolean = this.handsontableSettings.hotInstance?.getData()[row][1];

          if (isExpanded) {
            //replace class collapsed-row with expanded-row.
            rowElement.classList.remove("collapsed-row");
            rowElement.classList.add("expanded-row");
          }
          else {
            //replace class collapsed-row with expanded-row.
            rowElement.classList.remove("expanded-row");
            rowElement.classList.add("collapsed-row");
          }


        }
        else {

          //remove class from tr.
          rowElement.removeAttribute("class");

        }

      },

      afterGetRowHeader: (row, TH) => {
        //get row elmenet.
        const rowElement = TH.closest("tr")!;

        //check parent row
        const isParent: boolean = this.handsontableSettings.hotInstance?.getData()[row][0];

        if (isParent) {

          //set class parent-row to tr.
          rowElement.classList.add("parent-row");

          //check if row is expanded
          const isExpanded: boolean = this.handsontableSettings.hotInstance?.getData()[row][1];

          if (isExpanded) {
            //remove collapse-btn from th
            TH.querySelector(".relative")!.querySelectorAll(".collapse-btn").forEach((element) => {

              element.remove();

            });
            //remove collapse-btn from th
            TH.querySelector(".relative")!.querySelectorAll(".expande-btn").forEach((element) => {

              element.remove();

            });

            //set class expanded-row to tr..
            rowElement.classList.remove("collapsed-row");
            rowElement.classList.add("expanded-row");

            //create a nested children ==> (expanded button)
            const collapseButton = document.createElement('span');
            //set class collapse-btn to button.
            collapseButton.classList.add("collapse-btn");
            //append button to th
            rowElement.querySelector(".relative")!.appendChild(collapseButton);
            //set event on click to button
            collapseButton.onclick = () => this.toggleRowState(row, rowElement, false); // Set the button's click handler

          }
          else {
            //remove collapse-btn from th
            TH.querySelector(".relative")!.querySelectorAll(".collapse-btn").forEach((element) => {

              element.remove();

            });
            //remove expande-btn from th
            TH.querySelector(".relative")!.querySelectorAll(".expande-btn").forEach((element) => {

              element.remove();

            });

            //set class collapse-row to tr.
            rowElement.classList.remove("expanded-row");
            rowElement.classList.add("collapsed-row");

            //create a nested children ==> (expanded button)
            const expandeButton = document.createElement('span');
            //set class collapse-btn to button.
            expandeButton.classList.add("expande-btn");
            //append button to th
            TH.querySelector(".relative")!.appendChild(expandeButton);
            //set event on click to button
            expandeButton.onclick = () => this.toggleRowState(row, rowElement, true); // Set the button's click handler

          }

        }
        else {
          //remove class from tr.
          rowElement.removeAttribute("class");


          //remove collapse-btn from th
          TH.querySelector(".relative")!.querySelectorAll(".collapse-btn").forEach((element) => {

            element.remove();

          });

          //remove expande-btn from th
          TH.querySelector(".relative")!.querySelectorAll(".expande-btn").forEach((element) => {

            element.remove();

          });
        }

      },

      afterCreateRow: () => {

        //render handsontable
        this.renderAllHandsontable();

      },

      afterRemoveRow: () => {

        //render handsontable
        this.renderAllHandsontable();

      },

      licenseKey: 'non-commercial-and-evaluation',


    }
  }

  toggleRowState(row: number, rowElement: HTMLElement, isExpanded: boolean) {

    this.handsontableSettings.hotInstance.deselectCell();

    //check if isExpanded 
    if (isExpanded) { //make it expande

      //check if row has nested-handsontable.
      const hasAlreadyNestedRow = rowElement.querySelector(".nested-handsontable");

      if (hasAlreadyNestedRow) { //nested-handsontable is already created once

        //remove d-none from nested-handsontable
        rowElement.querySelector(".nested-handsontable")?.classList.remove("invisible-state");

        //change row state to expanded
        this.handsontableSettings.hotInstance.setDataAtCell(row, 1, true); // Get all data

        this.handsontableSettings.hotInstance.loadData(this.handsontableSettings.hotInstance.getData());

        //render handsontable
        this.renderAllHandsontable();


      }
      else //nested-handsontable not created once
      {
        //get children from object
        const handsontableChildren: any[] = this.handsontableSettings.hotInstance
          .getData()[row][this.handsontableSettings.rowHeader.length - 1];
        //check if object has children
        if (handsontableChildren && handsontableChildren.length > 0) {

          //change row state to expanded
          this.handsontableSettings.hotInstance.setDataAtCell(row, 1, true); // Get all data

          //load data
          this.handsontableSettings.hotInstance.loadData(this.handsontableSettings.hotInstance.getData());

          //add dynamic
          this.createDynamicNestedHandsontable(row, rowElement, handsontableChildren);

        }

      }

    }
    else //make it collapse
    {

      //add d-none to nested-container
      rowElement.querySelector(".nested-handsontable")?.classList.add("invisible-state");

      //get row from data by row index
      this.handsontableSettings.hotInstance.setDataAtCell(row, 1, false); // Get all data

      this.handsontableSettings.hotInstance.loadData(this.handsontableSettings.hotInstance.getData());

      //render handsontable
      this.renderAllHandsontable();

    }

    this.updateNestedSettings(row);

    this.renderAllHandsontable();


  }

  updateNestedSettings(row: number) {

    const handsontableData: any = this.handsontableSettings.hotInstance.getData(); // Get all data

    const hasExpandedRow: boolean = handsontableData.some((row: any) => row[1]);

    if (hasExpandedRow) {

      //apply on general 
      if (this.handsontableSettings.hotInstance) {
        this.handsontableSettings.hotInstance.updateSettings({
          data: this.handsontableSettings.hotInstance.getData(),
          disableVisualSelection: true,
          manualRowMove: false,
          manualColumnMove: false,
          // manualColumnResize: false,
          dropdownMenu: false,
          contextMenu: undefined,
          multiColumnSorting: {
            sortEmptyCells: false,
            headerAction: false,
            indicator: false
          }
        });
      }

      //apply on row
      const totalColumns = this.handsontableSettings.hotInstance.countCols();

      for (let col = 0; col < totalColumns; col++) {

        this.handsontableSettings.hotInstance.setCellMetaObject(row, col, {

          readOnly: true,

        })

      }


    }
    else {

      if (this.handsontableSettings.hotInstance) {
        this.handsontableSettings.hotInstance.updateSettings({
          data: this.handsontableSettings.hotInstance.getData(),
          disableVisualSelection: false,
          manualRowMove: true,
          manualColumnMove: true,
          // manualColumnResize: true,
          dropdownMenu: this.dropdownItems,
          contextMenu: this.contextMenu,
          multiColumnSorting: {
            sortEmptyCells: true,
            headerAction: true,
            indicator: false
          }
        });
      }

      //apply on row
      const totalColumns = this.handsontableSettings.hotInstance.countCols();

      for (let col = 0; col < totalColumns; col++) {

        this.handsontableSettings.hotInstance.setCellMetaObject(row, col, {

          readOnly: false,

        })

      }

    }

  }

  renderAllHandsontable() {

    for (let index = 0; index < NestedGridWrapperComponent.nestedTableStatic.length; index++) {

      setTimeout(() => {
        NestedGridWrapperComponent.nestedTableStatic[index].handsontableSettings.hotInstance.refreshDimensions();
        NestedGridWrapperComponent.nestedTableStatic[index].handsontableSettings.hotInstance.render();
      }, 0)

    }

    for (let index = NestedGridWrapperComponent.nestedTableStatic.length - 1; index >= 0; index--) {

      setTimeout(() => {
        NestedGridWrapperComponent.nestedTableStatic[index].handsontableSettings.hotInstance.refreshDimensions();
        NestedGridWrapperComponent.nestedTableStatic[index].handsontableSettings.hotInstance.render();
      }, 0)

    }
  }

  //Open nested Grid Options Dialog.
  nestedOptionsDialogDisplay() {
    this._nestedOptionsDialogDisplay = true;
  }

  //Open nested Grid Options Dialog.
  nestedOptionsDialogClose() {
    this._nestedOptionsDialogDisplay = false;
  }

  displayPyramidGrid() {
    this._displayPyramidGrid = !this._displayPyramidGrid;
  }

  //toggle table state 
  onTableToggleState(event: any) {

    //check if user selected expand or collapse
    if (!event.checked) { //select collapse

      let btns = Array.from(document.querySelectorAll('.ht_nestingCollapse')) as Array<HTMLElement>


      for (let index = btns.length - 1; index >= 0; index--) {

        this.toggleState("collapse");

      }

    }
    else //select expand
    {
      let btns = Array.from(document.querySelectorAll('.ht_nestingExpand')) as Array<HTMLElement>


      for (let index = btns.length - 1; index >= 0; index--) {

        this.toggleState("expand");

      }
    }

  }

  //change toggle state
  toggleState(state: string) {


    if (state == "collapse") { //collapsed

      let btns = Array.from(document.querySelectorAll('.ht_nestingCollapse')) as Array<HTMLElement>

      if (btns[btns.length - 1] != undefined) {
        const clickEvent = new MouseEvent('mousedown', {
          bubbles: true,
          cancelable: true,
          view: window
        });

        // Dispatch the event
        btns[btns.length - 1].dispatchEvent(clickEvent);

      }

    }
    else //expanded
    {
      let btns = Array.from(document.querySelectorAll('.ht_nestingExpand')) as Array<HTMLElement>

      if (btns[0] != undefined) {
        const clickEvent = new MouseEvent('mousedown', {
          bubbles: true,
          cancelable: true,
          view: window
        });

        // Dispatch the event
        btns[0].dispatchEvent(clickEvent);

      }
    }

  }


  //get random id
  getRandomId(): string {
    const random = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    return `hotInstance-${random}`;
  }


  ngOnDestroy(): void {
    NestedGridWrapperComponent.nestedTableStatic = [];
  }



}

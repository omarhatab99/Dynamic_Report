import { Injectable } from '@angular/core';
import { GridHTMLElement, GridItemHTMLElement, GridStack, GridStackElement, GridStackOptions, GridStackWidget } from 'gridstack';
import { TextAreaWidget } from '../models/text-area-widget';
import Swal from 'sweetalert2';
import { FixedTableWidget } from '../models/fixed-table-widget';
import { ImageWidget } from '../models/image-widget';
import { TEXTTYPE } from '../wrappers-grid/textarea-grid-wrapper/textarea-grid-wrapper.component';

@Injectable({
  providedIn: 'root'
})
export class WidgetWrapperService {

  constructor(){}
   

  widgets_textarea_collection: TextAreaWidget[] = [
    new TextAreaWidget(3, 1, 6, "انجازات مشروعات وزارة التخطيط والتنميه الاقتصاديه.", TEXTTYPE.TITLE , true , true , true),
    new TextAreaWidget(3, 2, 6, "من مشروعات وبرامج خلال الفترة من 2018 الى 2024.", TEXTTYPE.TITLE , true , true , true),
    new TextAreaWidget(0, 9, 4, "اختبار الكلام يصير مواقف اتصالية من الطلاب. هذه الكتابة ستبرز عن اختبارت اللغة العربية خاصة مهارة", TEXTTYPE.NORMAL , true , true , true),
    new TextAreaWidget(4, 9, 4, "اختبار الكلام يصير مواقف اتصالية من الطلاب. هذه الكتابة ستبرز عن اختبارت اللغة العربية خاصة مهارة", TEXTTYPE.NORMAL , true , true , true),
    new TextAreaWidget(8, 9, 4, "اختبار الكلام يصير مواقف اتصالية من الطلاب. هذه الكتابة ستبرز عن اختبارت اللغة العربية خاصة مهارة", TEXTTYPE.NORMAL , true , true , true),

  ];




  fixed_rows:any[] = ["اسم المؤسسه", "الجهه التابع لها", "تاريخ اعتماد التقرير"];
  fixed_itemSource: any[] = [["وزارة التخطيط والتنميه", "وزارة التخطيط", "28/2/1999"]];

  widgets_fixedtables_collection: FixedTableWidget[] = [
    new FixedTableWidget(3, 4, 6, this.fixed_rows, this.fixed_itemSource , true , true , true),
  ];

  widgets_images_collection: ImageWidget[] = [];


  //intialize gridstack
  intializeGridstack(element: GridHTMLElement, options: GridStackOptions): GridStack {
    return new GridStack(element, options);
  }

  //get all widgets
  getAllGridItems(grid: GridStack) {
    return grid.getGridItems();
  }

  //get grid-stack-item by id
  getWidgetById(grid: GridStack, widgetId: string): GridStackElement {
    const widgetItem = grid.getGridItems().find((item) => item.getAttribute('id') === widgetId) as GridStackElement;
    return widgetItem ?? null;
  }

  //addTextWidget
  addTextWidget(collection: TextAreaWidget[], grid: GridStack, widget: TextAreaWidget) {
    //create object from text area 
    const newWidgetText = new TextAreaWidget(widget.x, widget.y, widget.w, "", widget.type);
    //add text to collection of textArea
    collection.push(newWidgetText);

    setTimeout(() => {
      const target_widget = grid.el.querySelector(`#${newWidgetText.id!}`)!;
      target_widget.querySelector(".text-editable")!.innerHTML = widget.content;

      //hadnle widget
      grid.getGridItems().forEach((item) => {
        grid.removeWidget(item);
        grid.addWidget(item, {});
        grid.commit();
      })
    }, 0);

  }

  //addImageWidget
  addImageWidget(collection: ImageWidget[], grid: GridStack, widget: ImageWidget) {
    //create object from text area 
    const newWidgetImage = new ImageWidget(widget.x, widget.y, widget.w, widget.url);
    //add text to collection of textArea
    collection.push(newWidgetImage);

    setTimeout(() => {
      //hadnle widget
      grid.getGridItems().forEach((item) => {
        grid.removeWidget(item);
        grid.addWidget(item, {});
        grid.commit();
      })
    }, 0);
  }


  //update grid item
  updateGridWidget(grid: GridStack, widgetId: any, options: GridStackWidget) {
    const gridWidget: GridStackElement = this.getWidgetById(grid, widgetId);
    //chcek if widget is not null
    if (gridWidget) {
      //update gridwidget
      grid.update(gridWidget, options);
      grid.commit();
    }

  }

  //update all grid items
  updateAllWidgetDynamically(grid: GridStack) {
    grid.getGridItems().forEach((item) => {

      setTimeout(() => {
        grid.removeWidget(item);
        grid.addWidget(item);
        grid.commit();
      }, 0)


    });
  }

  updateState(grid: GridStack, state: any[]) {
    grid.getGridItems().forEach((item, index) => {
      grid.update(item, { x: state[index].x, y: state[index].y, h: state[index].h, sizeToContent: true });
      grid.commit();
    });
  }

  //remove widget
  removeWidget(grid: GridStack, widgetId: string) {
    return new Promise((resolve, reject) => {
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
            const widgetItem = this.getWidgetById(grid, widgetId);

            if (widgetItem) {

              grid.removeWidget(widgetItem, true);

              Swal.fire({
                position: "center",
                icon: "success",
                title: "تم حذف العنصر بنجاح",
                showConfirmButton: false,
                timer: 1500
              });

              resolve(true);
            }
          }
          catch (error: any) {
            Swal.fire({
              position: "center",
              title: "حدث خطأ",
              text: "حدث خطأ اثناء تنفيذ العمليه",
              icon: "error",
              showConfirmButton: false,
            });
            resolve(false);
          }
        }
        else {
          resolve(false);
        }
      });


    });

  }

  //edit textarea widget
  getCurrentStateForItems(grid: GridStack) {
    let gridObjectsArray: any[] = [];

    grid.getGridItems().forEach((gridItem: GridItemHTMLElement) => {

      let id = gridItem.getAttribute("gs-id");
      let x = +gridItem.getAttribute("gs-x")!;
      let y = +gridItem.getAttribute("gs-y")!;
      let w = +gridItem.getAttribute("gs-w")!;
      let h = +gridItem.getAttribute("gs-h")!;
      const gridObjectItem = { id, x, y, w, h };
      gridObjectsArray.push(gridObjectItem);
    });

    return gridObjectsArray;
  }



}

import { Injectable } from '@angular/core';
import { Document, Packer, Paragraph, TextRun, Table, TableCell, TableRow, ImageRun } from 'docx';
import { HelperService } from './helper.service';
import { GridStack } from 'gridstack';
import { TableGridWrapperComponent } from '../wrappers-grid/table-grid-wrapper/table-grid-wrapper.component';
import * as docx from 'docx';


@Injectable({
  providedIn: 'root'
})
export class ExportWordService {

  constructor(private _HelperSerService: HelperService) { }

  exportToWord(grid: GridStack, screenMode: undefined | "landscape" | "portrait") {


    //Handle all images
    const allImages = document.querySelectorAll(".report-image-fixed");
    const allImagesArray: any[] = [];


    allImages.forEach((image: any) => {
      const imageBase64: any = this._HelperSerService.convertImageToBase64(image);
      const imageStyle: any = getComputedStyle(image);
      const imageReact: any = image.getBoundingClientRect();
      const paragraph = new Paragraph({

        children: [
          new ImageRun({
            data: imageBase64,
            transformation: {
              width: +imageStyle.width.replace("px", ""), // عرض الصورة بالبكسل
              height: +imageStyle.height.replace("px", ""), // ارتفاع الصورة بالبكسل
            },
          }),
        ],
        //paragraph properties
        frame: {
          type: 'absolute',
          position: { x: this._HelperSerService.getPositionOfElementInTwips(imageReact.x, imageReact.y).x, y: this._HelperSerService.getPositionOfElementInTwips(imageReact.x, imageReact.y).y },
          anchor: { horizontal: "page", vertical: "page" },
          width: 0,
          height: 0,
          rule: "atLeast",
        }
      });

      allImagesArray.push(paragraph);
    })


    //--------------------------------------------------------------------------------------------------------------------------------



    //All Parargraph Array
    const allParagraphArray: any[] = [];

    //Fixed paragraph
    const fixedParagraph = document.querySelectorAll(".text-fixed");

    fixedParagraph.forEach((textFixed) => {

      const textFixedStyle = getComputedStyle(textFixed);
      const textFixedReact = textFixed.getBoundingClientRect();

      const paragraph = new Paragraph({

        children: [
          new TextRun({
            text: textFixed.textContent!,
            size: +textFixedStyle.fontSize.replace("px", "") + 9,
            font: "Calibri",
            underline: { type: textFixedStyle.textDecorationLine == "underline" ? "single" : "none" },
            rightToLeft:true,
          })
        ],
        //paragraph properties
        wordWrap: true,
        alignment: textFixedStyle.textAlign as any,
        frame: {
          type: 'absolute',
          position: { x: this._HelperSerService.getPositionOfElementInTwips(textFixedReact.x, textFixedReact.y).x, y: this._HelperSerService.getPositionOfElementInTwips(textFixedReact.x, textFixedReact.y).y },
          anchor: { horizontal: "page", vertical: "page" },
          width: this._HelperSerService.pixelsToTwips(+textFixedStyle.width.replace("px", "")),
          height: 0,
          rule: "atLeast",
        }

      });

      allParagraphArray.push(paragraph);

    });


    //Get all text area
    const allTextArea = grid.el.querySelectorAll(".grid-stack-item .text-editable")!;
    const allTextAreaHandle = this._HelperSerService.GetAllChilds(allTextArea);

    //handle all textArea 
    allTextAreaHandle.forEach((textArea) => {

      const paragraph = new Paragraph({
        children: [
          new TextRun({
            text: textArea.element.textContent,
            size: +textArea.style.fontSize.replace("px", "") + 10,
            font: "Calibri",
            underline: { type: textArea.style.textDecorationLine == "underline" ? "single" : "none" },
            rightToLeft:true
          })
        ],
        //paragraph properties
        wordWrap: true,
        alignment: textArea.style.textAlign,
        frame: {
          type: 'absolute',
          position: { x: this._HelperSerService.getPositionOfElementInTwips(textArea.x, textArea.y).x, y: this._HelperSerService.getPositionOfElementInTwips(textArea.x, textArea.y).y },
          anchor: { horizontal: "page", vertical: "page" },
          width: this._HelperSerService.pixelsToTwips(+textArea.style.width.replace("px", "")),
          height: 0,
          rule: "atLeast",
        }

      });

      allParagraphArray.push(paragraph);

    });

    //----------------------------------------------------------------------------------------------------------------------------------
    //All Fixed Table
    const allFixedTableArray: any[] = [];

    //Fixed paragraph
    const fixedTables = document.querySelectorAll(".grid-stack-item .fixed-table");

    fixedTables.forEach((fixedTable) => {

      const fixedTableStyle = getComputedStyle(fixedTable);
      const fixedTableReact = fixedTable.getBoundingClientRect();

      const tableRows: TableRow[] = [];
      const fixedTable_tr = fixedTable.querySelectorAll("tr");

      fixedTable_tr.forEach((tr, index) => {

        const trStyle = getComputedStyle(tr);
        //check if this is table header th
        if (index == 0) {
          const table_header_th = tr.querySelectorAll("th");
          const table_header_th_cell_array: TableCell[] = [];

          //generate table cells
          table_header_th.forEach((th) => {
            const thStyle = getComputedStyle(th);
            const table_cell_th = new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: th.textContent!,
                      size: +thStyle.fontSize.replace("px", "") + 13,
                      font: "Calibri",
                      bold: true,
                      rightToLeft:true
                    })
                  ],
                  alignment: "center"
                })
              ],
              width: { size: `${this._HelperSerService.pixelsToMm(+thStyle.width.replace("px", ""))}mm` },
              verticalAlign: "center",
            });

            table_header_th_cell_array.push(table_cell_th);
          });

          //generate table row
          const tableRow = new TableRow({
            children: table_header_th_cell_array,
            tableHeader: true,
            height: { value: this._HelperSerService.pixelsToTwips(+trStyle.height.replace("px", "")), rule: "atLeast" },
          });

          //push table row to table row array
          tableRows.push(tableRow);

        }
        else {
          const table_data_td = tr.querySelectorAll("td");
          const table_data_td_cell_array: TableCell[] = [];

          table_data_td.forEach((td) => {
            const tdStyle = getComputedStyle(td);
            const table_cell_td = new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: td.textContent!,
                      size: +tdStyle.fontSize.replace("px", "") + 10,
                      font: "Calibri",
                      rightToLeft:true
                    })
                  ],
                  alignment: "center"
                })
              ],

              width: { size: `${this._HelperSerService.pixelsToMm(+tdStyle.width.replace("px", ""))}mm` },
              verticalAlign: "center",
            });

            table_data_td_cell_array.push(table_cell_td);
          });

          //generate table row
          const tableRow = new TableRow({
            children: table_data_td_cell_array,
            tableHeader: false,
            height: { value: this._HelperSerService.pixelsToTwips(+trStyle.height.replace("px", "")), rule: "atLeast" },
          });

          //push table row to table row array
          tableRows.push(tableRow);
        }

      });

      //generate table
      const table = new Table({
        visuallyRightToLeft: true,
        rows: tableRows,
        borders: {
          left: { size: 1, color: "#000000", style: "single" },
          right: { size: 1, color: "#000000", style: "single" },
          top: { size: 1, color: "#000000", style: "single" },
          bottom: { size: 1, color: "#000000", style: "single" },
        },
        float: {

          absoluteHorizontalPosition: this._HelperSerService.getPositionOfElementInTwips(fixedTableReact.x, fixedTableReact.y).x + (0.88 * this._HelperSerService.pixelsToTwips(+fixedTableStyle.width.replace("px", ""))),
          absoluteVerticalPosition: this._HelperSerService.getPositionOfElementInTwips(fixedTableReact.x, fixedTableReact.y).y,
        }
      });

      //push table in array of tables
      allFixedTableArray.push(table);

    });

    //-----------------------------------------------------------------------------------------------------------------------------
    //handle handsontables 
    const allHandsontablesArray: any[] = [];
    //get all handsontables
    TableGridWrapperComponent.tableStatic.forEach((handsontable, tIndex) => {

      //get table
      const tableRows: TableRow[] = [];
      const handson_table = handsontable.hotInstance.table;
      const handson_table_tr = handson_table.querySelectorAll("tr");

      //change in handsontable
      handsontable.hotInstance.updateSettings({ rowHeaders: false, height: "auto" });

      const handsontTableStyle = getComputedStyle(handson_table);
      const handsonTableReact = handson_table.getBoundingClientRect();

      handson_table_tr.forEach((tr, index) => {

        const trStyle = getComputedStyle(tr);

        //check if this is table header th
        if (index == 0) {
          const handson_table_header_th = tr.querySelectorAll("th");
          const handson_table_header_th_cell_array: TableCell[] = [];

          //generate table cells
          handson_table_header_th.forEach((th, thIndex) => {
            const thStyle = getComputedStyle(th);
            const handson_table_cell_th = new TableCell({
              children: [
                new Paragraph({
                  pageBreakBefore: (thIndex == 0) ? true : false,
                  children: [
                    new TextRun({
                      text: th.textContent!,
                      size: +thStyle.fontSize.replace("px", "") + 13,
                      font: "Calibri",
                      bold: true,
                      rightToLeft:true
                    })
                  ],
                  alignment: "center",
                })
              ],
              shading: { color: "#d2fadb", fill: "#d2fadb", type: "solid" },
              width: { size: `${this._HelperSerService.pixelsToMm(+thStyle.width.replace("px", ""))}mm` },
              verticalAlign: "center",
            });

            handson_table_header_th_cell_array.push(handson_table_cell_th);
          });

          //generate table row
          const tableRow = new TableRow({
            children: handson_table_header_th_cell_array,
            tableHeader: true,
            height: { value: this._HelperSerService.pixelsToTwips(+trStyle.height.replace("px", "")), rule: "exact" },
          });

          //push table row to table row array
          tableRows.push(tableRow);

        }
        else {
          const handson_table_data_td = tr.querySelectorAll("td");
          const handson_table_data_td_cell_array: TableCell[] = [];

          handson_table_data_td.forEach((td) => {
            const tdStyle = getComputedStyle(td);
            const handson_table_cell_td = new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: td.textContent!,
                      size: +tdStyle.fontSize.replace("px", "") + 10,
                      font: "Calibri",
                      rightToLeft: true
                    })
                  ],
                  alignment: "center"
                })
              ],

              width: { size: `${this._HelperSerService.pixelsToMm(+tdStyle.width.replace("px", ""))}mm` },
              verticalAlign: "center",
            });

            handson_table_data_td_cell_array.push(handson_table_cell_td);
          });

          //generate table row
          const tableRow = new TableRow({
            children: handson_table_data_td_cell_array,
            tableHeader: false,
            height: { value: this._HelperSerService.pixelsToTwips(+trStyle.height.replace("px", "")), rule: "atLeast" },
          });

          //push table row to table row array
          tableRows.push(tableRow);
        }

      });


      //generate table
      const table = new Table({
        visuallyRightToLeft: true,
        alignment: 'center',
        rows: tableRows,
        borders: {
          left: { size: 1, color: "#000000", style: "single" },
          right: { size: 1, color: "#000000", style: "single" },
          top: { size: 1, color: "#000000", style: "single" },
          bottom: { size: 1, color: "#000000", style: "single" },
        },
        float: {
          absoluteHorizontalPosition: this._HelperSerService.getPositionOfElementInTwips(handsonTableReact.x, handsonTableReact.y).x + (0.88 * this._HelperSerService.pixelsToTwips(+handsontTableStyle.width.replace("px", ""))),
          absoluteVerticalPosition: 500 * (tIndex + 1),
          horizontalAnchor: "text",
          verticalAnchor: "text",
        }
      });


      //push table in array of tables
      allHandsontablesArray.push(table);




    });





    const watermark = new Paragraph({
      heading: docx.HeadingLevel.HEADING_1,
      children: [
        new TextRun({
          text: 'Omar Abdelmoniem',
          bold: true,
          size: 80,
          color: "#999999",
          rightToLeft:true
        })
      ],
      //paragraph properties
      wordWrap: true,
      alignment: "center",
      frame: {
        type: 'alignment',
        alignment: { x: "center", y: "center" },
        anchor: { horizontal: "page", vertical: "page" },
        width: 0,
        height: 0,
        rule: "atLeast",
      },

    });

    const docWord = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: { left: "5mm", right: "5mm", top: "5mm", bottom: "5mm" },
              size: { orientation: screenMode },
            }
          },
          headers: { default: new docx.Header({ children: [watermark] }) },
          children: [

            ...allImagesArray,
            ...allParagraphArray,
            ...allFixedTableArray,
            ...allHandsontablesArray
          ]
        },
      ],
    });


    Packer.toBlob(docWord).then((blob) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'document.docx';
      link.click();
    });


  }

  exportNestedGridToWord(handsontableData: any[], screenMode: undefined | "landscape" | "portrait") {

    const allNestedHandsontablesArrayOfRows: TableRow[] = [];

    this.handleNestedGrid(handsontableData , allNestedHandsontablesArrayOfRows);

    //generate table
    const table = new Table({
      visuallyRightToLeft: true,
      // layout:'autofit',
      alignment: 'center',
      width: {size:`100%`},
      rows: allNestedHandsontablesArrayOfRows,
      borders: {
        left: { size: 1, color: "#000000", style: "single" },
        right: { size: 1, color: "#000000", style: "single" },
        top: { size: 1, color: "#000000", style: "single" },
        bottom: { size: 1, color: "#000000", style: "single" },
      },
      float: {
        absoluteHorizontalPosition: 0,
        absoluteVerticalPosition: 0 ,
        horizontalAnchor: "text",
        verticalAnchor: "text",

      },

    });

    const watermark = new Paragraph({
      heading: docx.HeadingLevel.HEADING_1,
      children: [
        new TextRun({
          text: 'Omar Abdelmoniem',
          bold: true,
          size: 80,
          color: "#999999",
          position:"50mm",
          rightToLeft:true
          
        })
      ],
      //paragraph properties
      wordWrap: true,
      alignment: "center",
      frame: {
        type: 'alignment',
        alignment: { x: "center", y: "center" },
        anchor: { horizontal: "page", vertical: "page" },
        width: 0,
        height: 0,
        rule: "atLeast",
        anchorLock:true,
        
      },

    });

    const docWord = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: { left: "5mm", right: "5mm", top: "5mm", bottom: "5mm" },
              size: { orientation: screenMode },
            }
          },
          headers: { default: new docx.Header({ children: [watermark] }) },
          children: [
            table
          ]
        },
      ],
    });


    Packer.toBlob(docWord).then((blob) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'document.docx';
      link.click();
    });


  }

  handleNestedGrid(handsontableData: any[], allNestedHandsontablesArrayOfRows: TableRow[]) {

    //get header of table 
    const header_table:string[] = Object.keys(handsontableData[0])
    .filter((el) => {return el != "children" && el != "isParent" && el != "isExpanded"});
    
    this.drawNestedGridHandsontable_header(header_table, allNestedHandsontablesArrayOfRows);

    //draw header of table.

    for (let index = 0; index < handsontableData.length; index++) {

      //check if row parent or no 
      if (handsontableData[index].isParent) {

        const handsontableChildren = handsontableData[index].children;

        delete handsontableData[index].isParent;
        delete handsontableData[index].isExpanded;
        delete handsontableData[index].children;

        const row_table:string[] = Object.values(handsontableData[index]);

        // startRow = startRow + 1
        this.drawNestedGridHandsontable_row(row_table , allNestedHandsontablesArrayOfRows);

        // this.startRow++;
        this.handleNestedGrid(handsontableChildren, allNestedHandsontablesArrayOfRows);

      }
      else {

        delete handsontableData[index].isParent;
        delete handsontableData[index].isExpanded;
        delete handsontableData[index].children;

        const row_table:string[] = Object.values(handsontableData[index]);

        this.drawNestedGridHandsontable_row(row_table , allNestedHandsontablesArrayOfRows);

      }

    }
    

  }


  drawNestedGridHandsontable_header(header_table: string[], allNestedHandsontablesArrayOfRows: TableRow[]) {

    const handsontable_header_cells: TableCell[] = [];

    header_table.forEach((header_table_data: string, index: number) => {

      const handsontable_cell = new TableCell({
        rowSpan:3,
        children: [
          new Paragraph({
            // pageBreakBefore: (index == 0) ? true : false,
            children: [
              new TextRun({
                text: header_table_data,
                size: 25,
                font: "Calibri",
                bold: true,
                rightToLeft:true
              })
            ],
            alignment: "center",
          })
        ],
        shading: { color: "#d2fadb", fill: "#d2fadb", type: "solid" },
        verticalAlign: "center",
      });

      handsontable_header_cells.push(handsontable_cell);

    });

    //generate table row
    const tableRow = new TableRow({
      children: handsontable_header_cells,
      tableHeader: true,      
    });



    allNestedHandsontablesArrayOfRows.push(tableRow);

  }

  drawNestedGridHandsontable_row(row_table: string[], allNestedHandsontablesArrayOfRows: TableRow[]) {

    const handsontable_row_cells: TableCell[] = [];

    row_table.forEach((row_table_data: string, index: number) => {

      const handsontable_cell = new TableCell({
        children: [
          new Paragraph({
            // pageBreakBefore: (index == 0) ? true : false,
            children: [
              new TextRun({
                text: row_table_data,
                size: 20,
                font: "Calibri",
                bold: false,
                rightToLeft:true
              })
            ],
            alignment: "center",
          })
        ],
        verticalAlign: "center",
      });

      handsontable_row_cells.push(handsontable_cell);

    });

    //generate table row
    const tableRow = new TableRow({
      children: handsontable_row_cells,
      tableHeader: true,      
    });



    allNestedHandsontablesArrayOfRows.push(tableRow);

  }

}

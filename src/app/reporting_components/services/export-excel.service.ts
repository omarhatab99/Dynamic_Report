import { ElementRef, Injectable } from '@angular/core';
import * as ExcelJS from "exceljs"
import FileSaver from 'file-saver';
import { HelperService } from './helper.service';
import { GridStack } from 'gridstack';
import { TableGridWrapperComponent } from '../wrappers-grid/table-grid-wrapper/table-grid-wrapper.component';
import { TextAreaGridWrapperComponent } from '../wrappers-grid/textarea-grid-wrapper/textarea-grid-wrapper.component';
import { NestedPyramidGridWrapperComponent } from '../wrappers-grid/nested-pyramid-grid-wrapper/nested-pyramid-grid-wrapper.component';



@Injectable({
  providedIn: 'root'
})
export class ExportExcelService {

  constructor(private _HelperService: HelperService) { }

  //Export as Grid.

  extractImage(worksheet: ExcelJS.Worksheet, workbook: ExcelJS.Workbook) {

    const allImagesFixed = Array.from(document.querySelectorAll(".report-image-fixed"));
    const allImagesDynamic = Array.from(document.querySelectorAll(".report-image-dynamic"));
    const allImages = [...allImagesFixed, ...allImagesDynamic];

    Array.from(allImages).forEach(async (image: any) => {


      //Get element position in html and compatible row and column in excel

      const imageReact = image.getBoundingClientRect();

      //Get element position in html and compatible row and column in excel
      const elementPosition = this._HelperService.getPositionOfElementInPixel(imageReact.x, imageReact.y);
      const elementPositionExcel = this._HelperService.convertPixelsToExcel(elementPosition.x, elementPosition.y);

      const imageBase64 = this._HelperService.convertImageToBase64(image);

      // Add image to workbook
      const imageId = workbook.addImage({
        base64: imageBase64,
        extension: 'png', // or 'jpeg', 'jpg', etc.
      });

      // Add image to worksheet
      worksheet.addImage(imageId, {
        tl: { col: elementPositionExcel.column - 1.7, row: elementPositionExcel.row - 1.4 },
        ext: { width: image.width, height: image.height } // Adjust the size as needed
      });

    });

  }

  //handle paragraph
  extractParagraphFixed(worksheet: ExcelJS.Worksheet) {
    //Fixed paragraph
    const fixedParagraph = document.querySelectorAll(".text-fixed");

    fixedParagraph.forEach((textFixed: any) => {

      const textFixedReact = textFixed.getBoundingClientRect();

      //Get element position in html and compatible row and column in excel
      const elementPosition = this._HelperService.getPositionOfElementInPixel(textFixedReact.x, textFixedReact.y);
      const elementPositionExcel = this._HelperService.convertPixelsToExcel(elementPosition.x, elementPosition.y);

      const text = textFixed.textContent || '';

      const excelCell = worksheet.getCell(elementPositionExcel.row, elementPositionExcel.column);
      excelCell.value = text;

      this._HelperService.setCellStyle(excelCell, textFixed);

    });
  }

  //handle paragraph
  extractParagraphDynamic(worksheet: ExcelJS.Worksheet, grid: GridStack) {
    //Get all dynamic text area
    const allTextArea = grid.el.querySelectorAll(".grid-stack-item .text-editable")!;
    const allTextAreaHandle = this._HelperService.GetAllChilds(allTextArea);

    //handle all textArea 
    allTextAreaHandle.forEach((textArea) => {

      //Get element position in html and compatible row and column in excel
      const elementPosition = this._HelperService.getPositionOfElementInPixel(textArea.x, textArea.y);
      const elementPositionExcel = this._HelperService.convertPixelsToExcel(elementPosition.x + 100, elementPosition.y);

      const text = textArea.element.textContent || '';

      const excelCell = worksheet.getCell(elementPositionExcel.row, elementPositionExcel.column);
      excelCell.value = text;

      excelCell.font = {
        size: +textArea.style.fontSize.replace("px", "") - 3,
        bold: true,
        color: { argb: this._HelperService.rgbToArgb(textArea.style.color) }, // Red text
        italic: textArea.style.fontStyle == "italic" ? true : false,
        underline: textArea.style.textDecoration.startsWith("none") ? "none" : "single"
      },
        excelCell.alignment = {
          vertical: 'middle',
          horizontal: textArea.style.textAlign == "center" ? "center" : textArea.style.textAlign == "right" ? "right" : "left"
        };
    });

  }


  extractFixedTable(worksheet: ExcelJS.Worksheet) {
    const tables = document.querySelectorAll(".grid-stack-item table.fixed-table");

    tables.forEach((table: any) => {

      const tableRect = table.getBoundingClientRect();
      const tableHeadings: any[] = Array.from(table.querySelectorAll("thead th")).reverse();
      const tableDataRows: any[] = Array.from(table.querySelectorAll("tbody tr"));


      const cellWidth = 64;  //Example cell width in character units
      const cellHeight = 20;  //Example cell height in pixels

      let elementPosition = this._HelperService.getPositionOfElementInPixel(tableRect.x - 100, tableRect.y);
      let elementPositionExcel = this._HelperService.convertPixelsToExcel(elementPosition.x, elementPosition.y);

      //order column to merge cell.
      let orderColumn = elementPositionExcel.column;
      //order row to merge cell.
      let orderRow = elementPositionExcel.row;
      //header number of merged
      let headerNumberOfMergedRow: number = 0; //عند عمل لوب على ال Table Data cell //loop on table th


      Array.from(tableHeadings).forEach((tableHeaderCell: any, colIndex: any) => {

        //لو انا مش فى العمود الاول
        if (colIndex > 0)
          elementPositionExcel.column = orderColumn;

        const { offsetWidth, offsetHeight } = tableHeaderCell;

        //Calculate the number of cells needed based on the div's dimensions
        let numberOfColumns = Math.ceil(offsetWidth / cellWidth);
        let numberOfRows = Math.floor(offsetHeight / cellHeight);

        const cellHeaderTarget = worksheet.getCell(elementPositionExcel.row, (elementPositionExcel.column));
        cellHeaderTarget.value = tableHeaderCell.innerText;


        //merge cell
        const getEndMergedColumn = (elementPositionExcel.column + (numberOfColumns - 1));
        const getEndMergedRow = (elementPositionExcel.row + (numberOfRows - 1));

        worksheet.mergeCells(elementPositionExcel.row, elementPositionExcel.column, getEndMergedRow, getEndMergedColumn);

        this._HelperService.getNormalTableCellsStyle(worksheet, cellHeaderTarget, table as HTMLElement);

        //الكولون اللى عليه الدول يتعرض
        orderColumn = getEndMergedColumn + 1;
        orderRow = getEndMergedRow + 1;
      });


      //reset some Data
      elementPositionExcel = this._HelperService.convertPixelsToExcel(elementPosition.x, elementPosition.y);
      orderColumn = this._HelperService.convertPixelsToExcel(elementPosition.x, elementPosition.y).column;
      //start table body data
      //loop on table row
      tableDataRows.forEach((tableRow: HTMLElement, rowIndex: number) => {

        const handleChildNodes = Array.from(tableRow.childNodes).filter((x: ChildNode) => x.nodeType != Node.COMMENT_NODE).reverse();

        const tableDataCells = Array.from(handleChildNodes);
        //table data cell 
        tableDataCells.forEach((tableCell: any, colIndex: number) => {

          if (colIndex > 0) {
            elementPositionExcel.column = orderColumn;
          }
          const { offsetWidth, offsetHeight } = tableCell;

          //Calculate the number of cells needed based on the div's dimensions
          let numberOfColumns = Math.ceil(offsetWidth / cellWidth);
          let numberOfRows = Math.floor(offsetHeight / cellHeight);

          if (colIndex == 0) {
            elementPositionExcel.row = orderRow;
          }

          //merge cell
          const getEndMergedColumn = (elementPositionExcel.column + (numberOfColumns - 1));
          const getEndMergedRow = (elementPositionExcel.row + (numberOfRows - 1));

          const cellDataTarget = worksheet.getCell(elementPositionExcel.row, elementPositionExcel.column);

          cellDataTarget.value = tableCell.innerText;

          worksheet.mergeCells(elementPositionExcel.row, elementPositionExcel.column, getEndMergedRow, getEndMergedColumn);

          this._HelperService.getNormalTableCellsStyle(worksheet, cellDataTarget, tableCell);

          //الكولون اللى عليه الدول يتعرض
          orderColumn = getEndMergedColumn + 1;
          orderRow = getEndMergedRow + 1;

        });


        elementPositionExcel = this._HelperService.convertPixelsToExcel(elementPosition.x, elementPosition.y);
        elementPositionExcel.row = elementPositionExcel.row + headerNumberOfMergedRow;
        orderColumn = elementPositionExcel.column;

      });


    });
  }

  extractHandsontable(worksheet: ExcelJS.Worksheet) {

    const handsontables = TableGridWrapperComponent.tableStatic.map((handsontableInstance) => handsontableInstance.hotInstance.table);

    handsontables.forEach((handsontableElement: any) => {

      const tableRect = handsontableElement.getBoundingClientRect();

      const tableHeadings = Array.from(handsontableElement.querySelectorAll("thead th")).reverse();
      const tableDataRows = Array.from(handsontableElement.querySelectorAll("tbody tr"));

      let elementPosition = this._HelperService.getPositionOfElementInPixel(tableRect.x, tableRect.y);
      let elementPositionExcel = this._HelperService.convertPixelsToExcel(elementPosition.x, elementPosition.y);

      if (elementPositionExcel.column < 0)
        elementPositionExcel.column = 1;

      this.drawTableCells(worksheet, tableHeadings, tableDataRows, elementPositionExcel, handsontableElement);

    });

  }

  drawTableCells(worksheet: ExcelJS.Worksheet, cellsHeadersData: any[], cellsBodyData: any[], cellObject: { column: number, row: number }, handsontableElement: any) {


    const cellWidth = 64;  //Example cell width in character units
    const cellHeight = 20;  //Example cell height in pixels

    //order column to merge cell.
    let orderColumn = cellObject.column;
    //order row to merge cell.
    let orderRow = cellObject.row;
    //header number of merged
    let headerNumberOfMergedRow: number = 0; //عند عمل لوب على ال Table Data cell 
    cellsHeadersData.forEach((tableHeaderCell: any, colIndex: number) => {

      //لو انا مش فى العمود الاول
      if (colIndex > 0)
        cellObject.column = orderColumn;


      const colHeader = tableHeaderCell.querySelector(".colHeader");
      const { offsetWidth, offsetHeight } = tableHeaderCell;

      //Calculate the number of cells needed based on the div's dimensions
      let numberOfColumns = Math.ceil(offsetWidth / cellWidth);
      let numberOfRows = Math.floor(offsetHeight / cellHeight);

      const cellHeaderTarget = worksheet.getCell(cellObject.row, cellObject.column);

      cellHeaderTarget.value = colHeader.innerHTML;


      //merge cell
      const getEndMergedColumn = (cellObject.column + (numberOfColumns - 1));
      const getEndMergedRow = (cellObject.row + (numberOfRows - 1));

      worksheet.mergeCells(cellObject.row, cellObject.column, getEndMergedRow, getEndMergedColumn);

      //set style of cell
      this._HelperService.getHandsontableTableCellsStyle(worksheet, cellHeaderTarget, tableHeaderCell);

      //الكولون اللى عليه الدول يتعرض
      orderColumn = getEndMergedColumn + 1;
      orderRow = getEndMergedRow + 1;

    });

    const tableRect = handsontableElement.getBoundingClientRect();

    //reset some Data
    let elementPosition = this._HelperService.getPositionOfElementInPixel(tableRect.x, tableRect.y);
    cellObject = this._HelperService.convertPixelsToExcel(elementPosition.x, elementPosition.y);
    orderColumn = cellObject.column;

    //start table body data
    //loop on table row
    cellsBodyData.forEach((tableRow: HTMLElement, rowIndex: number) => {

      const tableDataCells = Array.from(tableRow.childNodes).reverse();
      //table data cell 
      tableDataCells.forEach((tableCell: any, colIndex: number) => {

        if (colIndex > 0) {
          cellObject.column = orderColumn;
        }

        const { offsetWidth, offsetHeight } = tableCell;


        //Calculate the number of cells needed based on the div's dimensions
        let numberOfColumns = Math.ceil(offsetWidth / cellWidth);
        let numberOfRows = Math.floor(offsetHeight / cellHeight);

        if (colIndex == 0) {
          cellObject.row = orderRow;
        }


        if (cellObject.column < 0)
          cellObject.column = 1;

        //merge cell
        const getEndMergedColumn = (cellObject.column + (numberOfColumns - 1));
        const getEndMergedRow = (cellObject.row + (numberOfRows - 1));
        const cellDataTarget = worksheet.getCell(cellObject.row, cellObject.column);
        cellDataTarget.value = tableCell.innerHTML;


        worksheet.mergeCells(cellObject.row, cellObject.column, getEndMergedRow, getEndMergedColumn);



        //set style of cell
        this._HelperService.getHandsontableTableCellsStyle(worksheet, cellDataTarget, tableCell);


        //الكولون اللى عليه الدول يتعرض
        orderColumn = getEndMergedColumn + 1;
        orderRow = getEndMergedRow + 1;


      });


      cellObject = this._HelperService.convertPixelsToExcel(elementPosition.x, elementPosition.y);
      cellObject.row = cellObject.row + headerNumberOfMergedRow;
      orderColumn = cellObject.column;

    });

  }


  async exportToExcel(grid: GridStack, mode: "landscape" | "portrait" , watermark:string) {

    TextAreaGridWrapperComponent.textStatic.forEach((element) => {
      element.handleLongText();
    });

    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    // Add text to the header
    worksheet.headerFooter.oddHeader = watermark;
    worksheet.headerFooter.evenHeader = watermark;

    worksheet.views = [{ state: 'normal', rightToLeft: false }];
    worksheet.pageSetup = {

      fitToPage: true,
      fitToWidth: 1,
      orientation: mode,
      paperSize: ExcelJS.PaperSize.A4,
      horizontalCentered: true,
      horizontalDpi: 96,

    };

    
    this.extractImage(worksheet, workbook);
    this.extractParagraphFixed(worksheet);
    this.extractParagraphDynamic(worksheet, grid);
    this.extractFixedTable(worksheet);
    this.extractHandsontable(worksheet);

    // Create buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Create a Blob from the buffer
    const blob = new Blob([buffer], { type: 'application/octet-stream' });

    // Use file-saver to save the file

    FileSaver.saveAs(blob, 'data.xlsx');


    TextAreaGridWrapperComponent.textStatic.forEach((element) => {
      element.removeHandleLongText();
    });
  }




  //Export As Nested.

  startRow = 1;
  startCol = 1;

  extractNestedGridHandsontable(worksheet: ExcelJS.Worksheet, handsontableData: any[], startCol: number) {

    //get table header.
    const header_table = Object.keys(handsontableData[0]).filter((el) => { return el != "children" && el != "isParent" && el != "isExpanded" });


    //draw header of table.
    this.drawNestedGridHandsontable_header(worksheet, header_table, this.startRow, startCol);

    for (let index = 0; index < handsontableData.length; index++) {

      this.startRow++;

      //check if row parent or no 
      if (handsontableData[index].isParent) {

        const handsontableChildren = handsontableData[index].children;

        const row:any = Object.fromEntries(
          Object.entries(handsontableData[index])
          .filter(([key, value]) => { return key != "children" && key != "isParent" && key != "isExpanded" })
        )


        const row_table:string[] = Object.values(row);

        this.drawNestedGridHandsontable_row(worksheet, row_table, (this.startRow), startCol , true);

        this.startRow++;

        this.extractNestedGridHandsontable(worksheet, handsontableChildren, (startCol + 1));

      }
      else {

        const row:any = Object.fromEntries(
          Object.entries(handsontableData[index])
          .filter(([key, value]) => { return key != "children" && key != "isParent" && key != "isExpanded" })
        )


        const row_table:string[] = Object.values(row);

        this.drawNestedGridHandsontable_row(worksheet, row_table, (this.startRow), startCol , false);


      }


    }

  }

  drawNestedGridHandsontable_header(worksheet: ExcelJS.Worksheet, header_table: string[], startRow: number, startCol: number) {

    header_table.forEach((header_table_data: string, index: number) => {

      //get cell from excel sheet by row and col.
      const cellHeaderTarget = worksheet.getCell(startRow, startCol + index); //2 , 2+0

      //add value to cell.
      cellHeaderTarget.value = header_table_data.toString();

      //make width of column compatible.
      worksheet.getColumn(startCol + index).width = cellHeaderTarget.value.length * 2;

      //styling
      cellHeaderTarget.style.alignment = {
        horizontal: "center",
        vertical: "middle"
      };

      cellHeaderTarget.style.fill = {
        type: 'pattern',     // Set the fill type
        pattern: 'solid',
        fgColor: { argb: "F0E68C" }   // Pattern type (solid, stripe, etc.)
      }

      cellHeaderTarget.style.border =
      {
        top: { style: 'thin', color: { argb: "#000" } },
        left: { style: 'thin', color: { argb: "#000" } },
        bottom: { style: 'thin', color: { argb: "#000" } },
        right: { style: 'thin', color: { argb: "#000" } },
      };

      cellHeaderTarget.font = {
        size: 14,
      };

    });

  }

  drawNestedGridHandsontable_row(worksheet: ExcelJS.Worksheet, row_table: string[], startRow: number, startCol: number , isParent:boolean) {


    // delete row.isParent;
    // delete row.isExpanded;
    // delete row.children;

    // const rowData: string[] = Object.values(row);


    row_table.forEach((data: string, index: number) => {

      //get cell from excel sheet by row and col.
      const cellRowTarget = worksheet.getCell(startRow, startCol + index); //2 , 2+0

      //add value to cell.
      cellRowTarget.value = data.toString();

      //make width of column compatible.
      worksheet.getColumn(startCol + index).width = cellRowTarget.value.length + 20;

      //styling
      cellRowTarget.style.alignment = {
        horizontal: "center",
        vertical: "middle"
      };

      cellRowTarget.style.fill = {
        type: 'pattern',     // Set the fill type
        pattern: 'solid',
        fgColor: { argb: isParent ? "ebf5fb" : "f8f9f9"}   // Pattern type (solid, stripe, etc.)
      }

      cellRowTarget.style.border =
      {
        top: { style: 'thin', color: { argb: "#000" } },
        left: { style: 'thin', color: { argb: "#000" } },
        bottom: { style: 'thin', color: { argb: "#000" } },
        right: { style: 'thin', color: { argb: "#000" } },
      };

      cellRowTarget.font = {
        size: 12,
      };

    });

  }

  nestedGridMergingByRow(worksheet: ExcelJS.Worksheet) {

    const actualColumnCount: number = worksheet.actualColumnCount;

    worksheet.eachRow((row, rowNumber) => {
      const lastCellColumnNumber: number = row.cellCount;

      // Define the row and columns for merging
      const startRow = rowNumber; // First row (Row number 1)
      const startCol = lastCellColumnNumber; // First column (Column number 1)
      const endRow = rowNumber;   // Same row (Row number 1)
      const endCol = actualColumnCount;   // Column number 3 (C)

      // Merging cells from row 1, column 1 to row 1, column 3 (A1, B1, C1)
      worksheet.mergeCells(startRow, startCol, endRow, endCol);

    });

  }

  nestedGridMergingByCol(worksheet: ExcelJS.Worksheet) {

    const actualRowCount: number = worksheet.actualRowCount;
    const actualColumnCount: number = worksheet.actualColumnCount;


    for (let col = 1; col <= actualColumnCount; col++) { //all columns

      let rangeCells = [];

      for (let row = 1; row <= actualRowCount; row++) { //all rows

        //get under cell 
        const emptyCell = worksheet.getCell(row , col);

        if ((emptyCell.value == undefined || emptyCell.value == null)) {

          rangeCells.push({ row,col })

        }
        else {
          if (rangeCells.length > 0) {

            // Define the row and columns for merging
            const startRow = rangeCells[0].row - 1; // First row (Row number 1)
            const startCol = rangeCells[0].col; // First column (Column number 1)
            const endRow = rangeCells[rangeCells.length - 1].row;   // Same row (Row number 1)
            const endCol = rangeCells[rangeCells.length - 1].col;   // Column number 3 (C)

            // Merging cells from row 1, column 1 to row 1, column 3 (A1, B1, C1)
            worksheet.mergeCells(startRow, startCol, endRow, endCol);

            rangeCells = [];

          }
        }

      }

      if (rangeCells.length > 0) {

        // Define the row and columns for merging
        const startRow = rangeCells[0].row - 1; // First row (Row number 1)
        const startCol = rangeCells[0].col; // First column (Column number 1)
        const endRow = rangeCells[rangeCells.length - 1].row;   // Same row (Row number 1)
        const endCol = rangeCells[rangeCells.length - 1].col;   // Column number 3 (C)

        // Merging cells from row 1, column 1 to row 1, column 3 (A1, B1, C1)
        worksheet.mergeCells(startRow, startCol, endRow, endCol);

        rangeCells = [];

      }

    }
  }

  async exportNestedPyramidGridToExcel(handsontablesDataArray:any[] , mode: "landscape" | "portrait" , watermark:string) {

    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    // Add text to the header
    worksheet.headerFooter.oddHeader = watermark;
    worksheet.headerFooter.evenHeader = watermark;

    worksheet.views = [{ state: 'normal', rightToLeft: true }];
    worksheet.pageSetup = {

      fitToPage: true,
      fitToWidth: 1,
      orientation: mode,
      paperSize: ExcelJS.PaperSize.A4,
      horizontalCentered: true,
      horizontalDpi: 96,
    };

    //extract Nested Grid
    this.extractNestedGridHandsontable(worksheet, handsontablesDataArray, this.startCol);
    this.nestedGridMergingByRow(worksheet);
    this.nestedGridMergingByCol(worksheet);

    this.startRow = 1;
    this.startCol = 1;

    // Create buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Create a Blob from the buffer
    const blob = new Blob([buffer], { type: 'application/octet-stream' });

    // Use file-saver to save the file

    FileSaver.saveAs(blob, 'data.xlsx');

  }
}

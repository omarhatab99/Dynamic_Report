import { Injectable } from '@angular/core';
import * as ExcelJS from "exceljs"

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  //Get all childs
  GetAllChilds(collection: NodeListOf<Element>): any[] {

    const elementCollection: any[] = [];

    collection.forEach((element: Element) => {
      //loop on elements
      if (element.nodeType == Node.TEXT_NODE) {
        const parentElement = element.parentElement!;
        const peStyle = getComputedStyle(parentElement);
        const pePosition = parentElement.getBoundingClientRect();
        const elementData = { element: element, style: peStyle, x: Math.trunc(pePosition.x), y: Math.trunc(pePosition.y ) }
        elementCollection.push(elementData);
      }

      if (element.nodeType == Node.ELEMENT_NODE) {
        retriveChilds(element)
      }

    });


    function retriveChilds(element: Element | ChildNode) {
      element.childNodes.forEach((childNode: ChildNode) => {
        if (childNode.nodeType == Node.TEXT_NODE) {
          const parentElement = childNode.parentElement!;
          const peStyle = getComputedStyle(parentElement)
          const pePosition = parentElement.getBoundingClientRect();
          const elementData = { element: childNode, style: peStyle, x: Math.trunc(pePosition.x), y: Math.trunc(pePosition.y) }
          elementCollection.push(elementData);
        }
        else {
          retriveChilds(childNode)
        }
      })
    }

    const set = new Set(elementCollection);

    return [...set];

  }


    // Convert pixels to millimeters
    convertPixelsToMm(pixels: number): number {
      const mmPerInch = 25.4; // 1 inch = 25.4 mm
      return (pixels / 96) * mmPerInch;
    }


  //Get position of element
  //Get position of element
  getPositionOfElementInTwips(x: number, y: number): { x: number, y: number } {
    const container = document.querySelector(".reporting-container")!;
    const containerReact = container?.getBoundingClientRect();

    return { x: this.pixelsToTwips((x - containerReact.x)), y: this.pixelsToTwips((y - containerReact.y)) }
  }

  //Convert pixel to twips
  pixelsToTwips(pixels: number, dpi = 96) {
    // Convert pixels to points
    const points = (pixels * 72) / dpi;
    // Convert points to twips
    const twips = points * 20;
    return twips;
  }

  //Convert pixel to twips
  pixelsToMm(pixels: number, ppi: number = 96): number {
    return (pixels / ppi) * 25.4;
  }



  //------------------------------------------------------------- excel--------------------------------
  
  //get element position
  getPositionOfElementInPixel(x: number, y: number): { x: number, y: number } {

    const container = document.querySelector(".reporting-container")!;
    const containerReact = container?.getBoundingClientRect();
    return { x: x , y: y - containerReact.y };

  }

  //conver this position to row and column in excel
  convertPixelsToExcel(x: number, y: number): { column: number, row: number } {
    const columnWidthInPixels = 64; // Default width of an Excel column
    const rowHeightInPixels = 20;   // Default height of an Excel row

    let column = Math.floor(x / columnWidthInPixels) + 1; // Convert X to column number
    let row = Math.floor(y / rowHeightInPixels) + 1;     // Convert Y to row number

    return { column, row };
  }


  setCellStyle(cell: ExcelJS.Cell, element: HTMLElement) {
    const elementStyle = this.getCurrentStyleOfElement(element);
    console.log(elementStyle.fontSize);
    cell.font = {
        size: 14,
        bold: true,
        color: { argb: this.rgbToArgb(elementStyle.color) }, // Red text
        italic: elementStyle.fontStyle == "italic" ? true : false,
        underline: elementStyle.textDecoration.startsWith("none") ? "none" : "single"
    };
    cell.alignment = {
        vertical: 'middle',
        horizontal: elementStyle.textAlign == "center" ? "center" : elementStyle.textAlign == "right" ? "right" : "left"
    };

    


    // console.log(cell.alignment.horizontal)
    // cell.fill = {
    //   type: 'pattern',
    //   pattern: 'solid',
    //   fgColor: {argb:this.rgbToArgb(elementStyle.backgroundColor)},
    // };
};


rgbToArgb(color: string): string {
  // Match the RGB color string
  const rgbMatch = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

  if (rgbMatch) {
      const r = parseInt(rgbMatch[1], 10);
      const g = parseInt(rgbMatch[2], 10);
      const b = parseInt(rgbMatch[3], 10);

      // Convert RGB to ARGB format
      return `FF${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`; // Full opacity
  }
  else {
      return "transparent"
  }

}

getCurrentStyleOfElement(element: any) {

  let currentStyle: CSSStyleDeclaration = getComputedStyle(element);

  return {
      backgroundColor: this.rgbToArgb(currentStyle.backgroundColor),
      color: this.rgbToArgb(currentStyle.color),
      fontFamily: currentStyle.fontFamily,
      fontStyle: currentStyle.fontStyle,
      fontSize: +currentStyle.fontSize.replace("px", ""),
      textAlign: currentStyle.textAlign,
      borderWidth: currentStyle.borderWidth,
      borderColor: this.rgbToArgb(currentStyle.borderColor),
      borderStyle: currentStyle.borderStyle,
      textDecoration: currentStyle.textDecoration
  }

};



convertImageToBase64(image: HTMLImageElement): string | undefined {
  let base64StringFinal = undefined;
  if (image) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (ctx) {
          canvas.width = image.naturalWidth;
          canvas.height = image.naturalHeight;

          // Draw the full image onto the canvas
          ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);

          // Get base64 string
          const base64String = canvas.toDataURL('image/png');
          base64StringFinal = base64String;

          // Use base64 string as needed
      }
  }

  return base64StringFinal;
}



getNormalTableCellsStyle(worksheet: ExcelJS.Worksheet, cell: ExcelJS.Cell, elementHtml: HTMLElement) {
  //get cell style

  const currentStyles = this.getCurrentStyleOfElement(elementHtml);
  cell.style.alignment = {
      horizontal: "center",
      vertical: "middle"
  };

  cell.style.border =
  {
      top: { style: 'thin', color: { argb: currentStyles.borderColor } },
      left: { style: 'thin', color: { argb: currentStyles.borderColor } },
      bottom: { style: 'thin', color: { argb: currentStyles.borderColor } },
      right: { style: 'thin', color: { argb: currentStyles.borderColor } },
  };

  cell.font = {
      size: currentStyles.fontSize,
      color: { argb: currentStyles.color }, // Red text
      italic: currentStyles.fontStyle == "italic" ? true : false,
      underline: currentStyles.textDecoration.startsWith("none") ? "none" : "single"
  };

}



getHandsontableTableCellsStyle(worksheet: ExcelJS.Worksheet, cell: ExcelJS.Cell, elementHtml: HTMLElement) {
  //get cell style

  const currentStyles = this.getCurrentStyleOfElement(elementHtml);
  cell.style.alignment = {
      horizontal: currentStyles.textAlign as any,
      vertical: "middle"
  };

  cell.style.fill = {
      type: 'pattern',     // Set the fill type
      pattern: 'solid',    // Pattern type (solid, stripe, etc.)
      fgColor: { argb: currentStyles.backgroundColor }  // Background color (yellow in this case)
  }

  cell.style.border =
  {
      top: { style: 'thin', color: { argb: currentStyles.borderColor } },
      left: { style: 'thin', color: { argb: currentStyles.borderColor } },
      bottom: { style: 'thin', color: { argb: currentStyles.borderColor } },
      right: { style: 'thin', color: { argb: currentStyles.borderColor } },
  };

  cell.font = {
      size: currentStyles.fontSize - 2,
      color: { argb: currentStyles.color }, // Red text
      italic: currentStyles.fontStyle == "italic" ? true : false,
      underline: currentStyles.textDecoration.startsWith("none") ? "none" : "single"
  };

}

}


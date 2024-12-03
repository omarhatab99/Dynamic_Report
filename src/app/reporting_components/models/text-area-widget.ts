import { TEXTTYPE } from "../wrappers-grid/textarea-grid-wrapper/textarea-grid-wrapper.component";

export class TextAreaWidget {
    id: string = this.getRandomId();
    public x?: number | undefined = 0;
    public y?: number | undefined = 0;
    public w?: number | undefined = 1;
    public content?: any | undefined = "";
    public type?: TEXTTYPE = TEXTTYPE.NORMAL;
    public allowMoving:boolean;
    public allowEditing:boolean;
    public allowDeleting:boolean;
    

    constructor(x: number = 0, y: number = 0, w: number = 3, content: any = "", type: TEXTTYPE = TEXTTYPE.NORMAL , allowMoving:boolean = true , allowEditing:boolean = true , allowDeleting:boolean = true) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.content = content;
        this.type = type;
        this.allowMoving = allowMoving;
        this.allowEditing = allowEditing;
        this.allowDeleting = allowDeleting;
    }

        //get random id
        getRandomId(): string {
            const random = Math.floor(Math.random() * (999999 - 100000)) + 100000;
            return `text_widget-${random}`;
        }
}




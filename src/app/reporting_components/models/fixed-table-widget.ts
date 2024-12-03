export class FixedTableWidget {
    id: string = this.getRandomId();
    x?: number | undefined = 0;
    y?: number | undefined = 0;
    w?: number | undefined = 1;
    rows:any[] = [];
    itemSource:any[] = [];
    public allowMoving:boolean;
    public allowEditing:boolean;
    public allowDeleting:boolean;

    constructor(x: number = 0, y: number = 0, w: number = 3, rows: any[] , itemSource:any[] , allowMoving:boolean = true , allowEditing:boolean = true , allowDeleting:boolean = true) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.rows = rows;
        this.itemSource = itemSource;
        this.allowMoving = allowMoving;
        this.allowEditing = allowEditing;
        this.allowDeleting = allowDeleting;
    }

        //get random id
        getRandomId(): string {
            const random = Math.floor(Math.random() * (999999 - 100000)) + 100000;
            return `ftable_widget-${random}`;
        }
}




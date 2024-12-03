export class ImageWidget {
    id: string = this.getRandomId();
    public x?: number | undefined = 0;
    public y?: number | undefined = 0;
    public w?: number | undefined = 1;
    public url?: string = "";
    public allowMoving:boolean;
    public allowEditing:boolean;
    public allowDeleting:boolean;

    constructor(x: number = 0, y: number = 0, w: number = 3, url:string = "../../../assets/placeholder_image.png" , allowMoving:boolean = true , allowEditing:boolean = true , allowDeleting:boolean = true) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.url = url;
        this.allowMoving = allowMoving;
        this.allowEditing = allowEditing;
        this.allowDeleting = allowDeleting;
    }

        //get random id
        getRandomId(): string {
            const random = Math.floor(Math.random() * (999999 - 100000)) + 100000;
            return `image_widget-${random}`;
        }
}




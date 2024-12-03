export class TableWidget {
    id: string = this.getRandomId();
    public x?: number | undefined = 0;
    public y?: number | undefined = 0;
    public w?: number | undefined = 1;

    constructor(x: number = 0, y: number = 0, w: number = 3) {
        this.x = x;
        this.y = y;
        this.w = w;
    }

    //get random id
    getRandomId(): string {
        const random = Math.floor(Math.random() * (999999 - 100000)) + 100000;
        return `table_widget-${random}`;
    }
}




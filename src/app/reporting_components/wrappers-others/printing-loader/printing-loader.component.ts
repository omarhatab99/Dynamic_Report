import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-printing-loader',
  templateUrl: './printing-loader.component.html',
  styleUrls: ['./printing-loader.component.css']
})
export class PrintingLoaderComponent {

  @Input() mode:boolean = true;

  constructor(){}


  changeLoaderAfterTime(mode:boolean , seconds:number){
    setTimeout(() => {this.mode = mode} , seconds);
  }

  changeLoaderImmediately(mode:boolean){
    this.mode = mode;
  }

}

import { Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-aggregate',
  templateUrl: './aggregate.component.html',
  styleUrls: ['./aggregate.component.css']
})
export class AggregateComponent implements OnInit {
  value: any;
  @Input() reports: any[] = [];
  @Input() functions: any[] = [];
  columnFunctions: any[] = [];

  constructor() {

  }

  ngOnInit(): void {

  }


}

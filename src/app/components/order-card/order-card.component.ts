import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'order-card',
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.scss'],
})
export class OrderCardComponent implements OnInit {

  @Input() order;
  @Input() amIOwner;
  @Output() onNeedRefresh: EventEmitter<number> = new EventEmitter();
  constructor() { }

  ngOnInit() {}

}

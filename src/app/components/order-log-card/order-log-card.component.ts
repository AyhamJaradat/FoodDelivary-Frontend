import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'order-log-card',
  templateUrl: './order-log-card.component.html',
  styleUrls: ['./order-log-card.component.scss'],
})
export class OrderLogCardComponent implements OnInit {

  @Input() orderLog;
  constructor() { }
  ngOnInit() {}

}

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-currency-panel-card',
  templateUrl: './currency-panel-card.component.html',
  styleUrls: ['./currency-panel-card.component.css']
})
export class CurrencyPanelCardComponent implements OnInit {

  constructor() { }
  @Input() currency: string;
  @Input() convertedCurrency: number;
  
  ngOnInit(): void {
  }

}

import {Component, Input, OnInit, AfterViewInit} from '@angular/core';
import { CurrencyService } from "../../services/currency.service";
import { Currency } from "../../../scripts/ts/metadata/Currency";
import StringUtils from "../../../scripts/ts/utils/StringUtils";
import {ConnectionService} from "../../services/connection.service";
import {timer} from "rxjs";
import {animate, style, transition, trigger} from "@angular/animations";
import {Property} from "csstype";
import Float = Property.Float;

@Component({
  selector: 'app-chart-container',
  templateUrl: './chart-container.component.html',
  styleUrls: ['./chart-container.component.scss'],
  animations: [
    trigger('hideLoading', [
      transition(':leave', [
        style({ opacity: 1 }),
        animate('700ms cubic-bezier(0.680, -0.550, 0.460, 0.995)', style({ opacity: '0' })),
      ])
    ]),
    trigger('showNoConnection', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('700ms cubic-bezier(0.680, -0.550, 0.460, 0.995)', style({ opacity: '1', position: 'absolute' })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('700ms cubic-bezier(0.680, -0.550, 0.460, 0.995)', style({ opacity: '0', position: 'absolute' })),
      ])
    ])
  ]
})
export class ChartContainerComponent implements OnInit, AfterViewInit {
  public series = [{name: 'Price', data: [1, 2, 3]}];
  public xaxis: Object = {categories: [1, 2, 3]};
  public yaxis: Object = {}

  public dataLoaded: boolean;
  public timerPassed: boolean;

  @Input() chart;
  @Input() id: string;
  @Input() requestData: boolean;
  @Input() connected: boolean;

  public data: Currency;

  private _lastPrice: number = 0;
  private _lastUpdate: string = "now";
  private loadingTimer = timer(2000);

  constructor(private currencyService: CurrencyService) { }

  get lastPrice(): string {
    return this._lastPrice.toString() + " " + this.currencyService.globalCurrency;
  }

  get lastUpdate(): string {
    return this._lastUpdate;
  }

  ngOnInit(): void {
    this.loadingTimer.subscribe(() => {
      this.timerPassed = true;
    });
    if (this.requestData) {
      this.currencyService.getCurrency(this.id).subscribe( data => {
        this.data = Currency.fromJson(this.id, data);
        this.render();
        this.dataLoaded = true;
      });
    } else {
      this.setDefault();
      this.render();
    }
  }

  public render() {
    this.series = [{name: 'Price', data: this.data.priceStory.getValues().map(entry => parseFloat(entry))}];
    this.yaxis = {
      show: false
    }
    this.xaxis = {
      categories: this.data.priceStory.getKeys().map(entry => entry),
      tickAmount: 10
    };
    this.updateValues();
  }

  public forceShow(): void {
    this.dataLoaded = true;
  }

  private updateValues() {
    this._lastPrice = this.data ? this.data.priceStory.last().value as unknown as number : 0;
    this._lastUpdate = this.data ? this.data.priceStory.last().key : "now";
    this.id = this.data.id;
  }

  ngAfterViewInit(): void {
    if (this.data === undefined) {
      this.setDefault();
      this.render();
    }
  }

  getName(): string {
    return StringUtils.capitalize(this.id);
  }

  setDefault(): void {
    this.data = new Currency(this.id, [
      { price: "1", timestamp: 1 },
      { price: "2", timestamp: 3 },
      { price: "2", timestamp: 3 }
      ]);
  }
}

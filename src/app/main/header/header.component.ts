import { Component, OnInit, OnDestroy } from '@angular/core';
import { CurrencyService } from 'src/app/service/currency.service';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CurrencySymbol } from '../currency.enum';
import { GetCurrentRates } from './../currency.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  public usdToUah: number;
  public eurToUah: number;
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    const requests = [
      this.currencyService.getExchangeRates(CurrencySymbol.USD),
      this.currencyService.getExchangeRates(CurrencySymbol.EUR),
    ];

    forkJoin(requests)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (responses: GetCurrentRates[]) => {
          this.usdToUah = responses[0].rates.UAH;
          this.eurToUah = responses[1].rates.UAH;
        },
        (error) => {
          console.error('Error occurred while fetching exchange rates:', error);
        }
      );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

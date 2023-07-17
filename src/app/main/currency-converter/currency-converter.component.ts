import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CurrencyService } from 'src/app/service/currency.service';
import { CurrencySymbol } from '../currency.enum';
import { merge } from 'rxjs';

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.scss'],
})
export class CurrencyConverterComponent implements OnInit {
  public currencies: CurrencySymbol[] = [
    CurrencySymbol.UAH,
    CurrencySymbol.USD,
    CurrencySymbol.EUR,
    CurrencySymbol.PLN,
  ];
  public conversionForm: FormGroup;

  constructor(
    private currencyService: CurrencyService,
    private formBuilder: FormBuilder
  ) {}

  get currencyFrom() {
    return this.conversionForm.get('currencyFrom');
  }

  get currencyTo() {
    return this.conversionForm.get('currencyTo');
  }

  get fromAmount() {
    return this.conversionForm.get('fromAmount');
  }

  get toAmount() {
    return this.conversionForm.get('toAmount');
  }

  ngOnInit(): void {
    this.conversionForm = this.formBuilder.group({
      currencyFrom: [CurrencySymbol.UAH],
      currencyTo: [CurrencySymbol.EUR],
      fromAmount: [0],
      toAmount: [0],
    });

    this.fromAmount.valueChanges.subscribe(() => {
      this.convertCurrency();
    });

    this.toAmount.valueChanges.subscribe(() => {
      this.convertCurrency(true);
    });
  }

  convertCurrency(toAmountChanged: boolean = false): void {
    const { currencyFrom, currencyTo, fromAmount, toAmount } =
      this.conversionForm.value;

    if (!fromAmount && !toAmount) {
      this.conversionForm.patchValue({ toAmount: 0 }, { emitEvent: false });
      return;
    }

    if (toAmountChanged) {
      this.currencyService
        .getConvertedAmount(currencyTo, currencyFrom, toAmount)
        .subscribe((convertedAmount) => {
          console.log('convertedAmount to', convertedAmount);

          this.conversionForm.patchValue(
            { fromAmount: convertedAmount.result },
            { emitEvent: false }
          );
        });
    } else {
      this.currencyService
        .getConvertedAmount(currencyFrom, currencyTo, fromAmount)
        .subscribe((convertedAmount) => {
          console.log('convertedAmount from', convertedAmount);

          this.conversionForm.patchValue(
            { toAmount: convertedAmount.result },
            { emitEvent: false }
          );
        });
    }
  }

  switchCurrencies(): void {
    const currencyFromValue = this.currencyFrom.value;
    const currencyToValue = this.currencyTo.value;

    this.currencyFrom.setValue(currencyToValue, { emitEvent: false });
    this.currencyTo.setValue(currencyFromValue, { emitEvent: false });

    this.convertCurrency();
  }
}

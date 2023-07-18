import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CurrencyService } from 'src/app/service/currency.service';
import { CurrencySymbol } from '../currency.enum';
import { LimitsValidator } from '../empty-validator';
import { merge } from 'rxjs';

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.scss'],
})
export class CurrencyConverterComponent implements OnInit {
  public availableCurrencies: CurrencySymbol[] = Object.values(CurrencySymbol);

  public conversionForm: FormGroup;

  constructor(private currencyService: CurrencyService) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === '-') {
      event.preventDefault();
    }
  }

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
    this.conversionForm = new FormGroup({
      currencyFrom: new FormControl(CurrencySymbol.UAH),
      currencyTo: new FormControl(CurrencySymbol.EUR),
      fromAmount: new FormControl('', [
        Validators.min(0),
        LimitsValidator.maxLength(12),
        LimitsValidator.cannotBeEmpty,
      ]),
      toAmount: new FormControl('', [
        Validators.min(0),
        LimitsValidator.maxLength(12),
        LimitsValidator.cannotBeEmpty,
      ]),
    });

    this.fromAmount.valueChanges.subscribe(() => this.convertCurrency());
    this.toAmount.valueChanges.subscribe(() => this.convertCurrency(true));
  }

  getErrorMessage(controlName: string): string {
    const control = this.conversionForm.get(controlName);
    if (control?.errors) {
      for (const errorName in control.errors) {
        switch (errorName) {
          case 'cannotBeEmpty':
            return 'Value cannot be 0';
          case 'maxLength':
            return 'Value cannot exceed 12 characters';
          default:
            return '';
        }
      }
    }
    return '';
  }

  convertCurrency(toAmountChanged: boolean = false): void {
    const { currencyFrom, currencyTo, fromAmount, toAmount } =
      this.conversionForm.value;
    const fromCurrency = toAmountChanged ? currencyTo : currencyFrom;
    const toCurrency = toAmountChanged ? currencyFrom : currencyTo;
    const amount = toAmountChanged ? toAmount : fromAmount;

    if (!fromAmount && !toAmount) {
      return;
    }

    this.currencyService
      .getConvertedAmount(fromCurrency, toCurrency, amount)
      .subscribe((convertedAmount) => {
        const valueToUpdate = toAmountChanged ? 'fromAmount' : 'toAmount';

        this.conversionForm.patchValue(
          { [valueToUpdate]: convertedAmount.result },
          { emitEvent: false }
        );
      });
  }

  switchCurrencies(): void {
    const currencyFromValue = this.currencyFrom.value;
    const currencyToValue = this.currencyTo.value;

    this.currencyFrom.setValue(currencyToValue, { emitEvent: false });
    this.currencyTo.setValue(currencyFromValue, { emitEvent: false });

    this.convertCurrency();
  }
}

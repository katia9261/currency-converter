import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CurrencyService } from 'src/app/service/currency.service';
import { CurrencySymbol } from '../currency.enum';
import { LimitsValidator } from '../empty-validator';

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.scss'],
})
export class CurrencyConverterComponent implements OnInit {
  public availableCurrencies: CurrencySymbol[] = Object.values(CurrencySymbol);
  public conversionForm: FormGroup;
  private DEFAULT_FROM_CURRENCY = CurrencySymbol.UAH;
  private DEFAULT_TO_CURRENCY = CurrencySymbol.EUR;
  private errorMessages = {
    cannotBeEmpty: 'Value cannot be 0',
    maxLength: 'Value cannot exceed 12 characters',
  };

  constructor(private currencyService: CurrencyService) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === '-') {
      event.preventDefault();
    }
  }

  get fromAmount() {
    return this.conversionForm.get('fromAmount');
  }

  get toAmount() {
    return this.conversionForm.get('toAmount');
  }

  ngOnInit(): void {
    this.initForm();
    this.subscribeToValueChanges();
  }

  private subscribeToValueChanges(): void {
    this.fromAmount.valueChanges.subscribe(() => this.convertCurrency());
    this.toAmount.valueChanges.subscribe(() => this.convertCurrency(true));
  }

  private initForm(): void {
    this.conversionForm = new FormGroup({
      currencyFrom: new FormControl(this.DEFAULT_FROM_CURRENCY),
      currencyTo: new FormControl(this.DEFAULT_TO_CURRENCY),
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
  }

  getErrorMessage(controlName: string): string {
    const errors = this.conversionForm.get(controlName)?.errors;
    return errors ? this.errorMessages[Object.keys(errors)[0]] : '';
  }

  convertCurrency(toAmountChanged: boolean = false): void {
    const { currencyFrom, currencyTo } = this.conversionForm.value;

    const fromCurrency = toAmountChanged ? currencyTo : currencyFrom;
    const toCurrency = toAmountChanged ? currencyFrom : currencyTo;
    const amount = toAmountChanged
      ? this.toAmount.value
      : this.fromAmount.value;

    if (amount) {
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
  }

  switchCurrencies(): void {
    const { currencyFrom, currencyTo } = this.conversionForm.value;
    this.conversionForm.patchValue(
      {
        currencyFrom: currencyTo,
        currencyTo: currencyFrom,
      },
      { emitEvent: false }
    );

    this.convertCurrency();
  }
}

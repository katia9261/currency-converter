import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CurrencyConverterComponent } from './currency-converter.component';
import { CurrencyService } from 'src/app/service/currency.service';
import { of } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';

describe('CurrencyConverterComponent', () => {
  let component: CurrencyConverterComponent;
  let fixture: ComponentFixture<CurrencyConverterComponent>;
  let currencyService: CurrencyService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CurrencyConverterComponent],
      providers: [CurrencyService],
      imports: [
        ReactiveFormsModule,
        HttpClientModule,
        MatSelectModule,
        BrowserAnimationsModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyConverterComponent);
    component = fixture.componentInstance;
    currencyService = TestBed.inject(CurrencyService);

    spyOn(currencyService, 'getConvertedAmount').and.returnValue(
      of({ result: 100 })
    );

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize conversionForm with default values', () => {
    expect(component.conversionForm.value).toEqual({
      currencyFrom: 'UAH',
      currencyTo: 'EUR',
      fromAmount: '',
      toAmount: '',
    });
  });

  it('should update conversionForm values when currencyFrom or currencyTo changes', () => {
    component.currencyFrom.setValue('USD');
    component.currencyTo.setValue('GBP');

    expect(component.conversionForm.value).toEqual({
      currencyFrom: 'USD',
      currencyTo: 'GBP',
      fromAmount: '',
      toAmount: '',
    });
  });

  it('should switch currencies and convert currency', () => {
    component.currencyFrom.setValue('USD');
    component.currencyTo.setValue('GBP');
    component.switchCurrencies();

    expect(component.conversionForm.value).toEqual({
      currencyFrom: 'GBP',
      currencyTo: 'USD',
      fromAmount: '',
      toAmount: '',
    });
  });

  it('should return an empty string for unknown error', () => {
    const controlName = 'toAmount';
    const control = new FormControl('');
    component.conversionForm = new FormGroup({ [controlName]: control });
    const errorMessage = component.getErrorMessage(controlName);

    expect(errorMessage).toBe('');
  });
});

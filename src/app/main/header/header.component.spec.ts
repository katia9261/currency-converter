import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './header.component';
import { CurrencyService } from 'src/app/service/currency.service';
import { of } from 'rxjs';
import { GetCurrentRates } from './../currency.interface';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let currencyService: CurrencyService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [CurrencyService],
      imports: [HttpClientModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    currencyService = TestBed.inject(CurrencyService);

    spyOn(currencyService, 'getExchangeRates').and.returnValues(
      of({
        rates: { UAH: 26.5 },
      } as GetCurrentRates),
      of({
        rates: { UAH: 30.2 },
      } as GetCurrentRates)
    );

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch exchange rates for USD and EUR on initialization', () => {
    fixture.detectChanges();

    expect(currencyService.getExchangeRates).toHaveBeenCalledTimes(2);
    expect(currencyService.getExchangeRates).toHaveBeenCalledWith('USD');
    expect(currencyService.getExchangeRates).toHaveBeenCalledWith('EUR');
  });

  it('should set the exchange rates for USD and EUR', () => {
    fixture.detectChanges();

    expect(component.usdToUah).toEqual(26.5);
    expect(component.eurToUah).toEqual(30.2);
  });

  it('should unsubscribe from observables on component destruction', () => {
    spyOn((component as any).unsubscribe$, 'next');
    spyOn((component as any).unsubscribe$, 'complete');

    component.ngOnDestroy();

    expect((component as any).unsubscribe$.next).toHaveBeenCalled();
    expect((component as any).unsubscribe$.complete).toHaveBeenCalled();
  });
});

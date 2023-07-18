import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CurrencyService } from './currency.service';
import { CurrencySymbol } from '../main/currency.enum';
import { GetCurrentRates } from '../main/currency.interface';

describe('CurrencyService', () => {
  let service: CurrencyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CurrencyService],
    });
    service = TestBed.inject(CurrencyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch exchange rates successfully', () => {
    const expectedResponse: GetCurrentRates = {
      base: CurrencySymbol.USD,
      rates: {
        UAH: 27.5,
      },
      date: '07-18-2023',
    };

    service.getExchangeRates(CurrencySymbol.USD).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(
      `${(service as any).url}/latest?base=${'USD'}&symbols=${
        CurrencySymbol.UAH
      }&places=${(service as any).symbolsAfterComma}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(expectedResponse);
  });

  it('should convert currency successfully', () => {
    const from = CurrencySymbol.USD;
    const to = CurrencySymbol.EUR;
    const amount = 100;
    const expectedResponse = {
      result: 90,
    };

    service.getConvertedAmount(from, to, amount).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(
      `${
        (service as any).url
      }/convert?from=${from}&to=${to}&amount=${amount}&places${
        (service as any).symbolsAfterComma
      }`
    );
    expect(req.request.method).toBe('GET');
    req.flush(expectedResponse);
  });
});

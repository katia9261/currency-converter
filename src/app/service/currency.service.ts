import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CurrencySymbol } from '../main/currency.enum';
import { GetCurrentRates } from '../main/currency.interface';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private url = 'https://api.exchangerate.host';
  private symbolsAfterComma = 4;

  constructor(private http: HttpClient) {}

  getExchangeRates(currency: string): Observable<GetCurrentRates> {
    return this.http
      .get<GetCurrentRates>(
        `${this.url}/latest?base=${currency}&symbols=${CurrencySymbol.UAH}&places=${this.symbolsAfterComma}`
      )
      .pipe(
        catchError((error) => {
          console.error('Error occurred while fetching exchange rates:', error);
          return throwError(error);
        })
      );
  }
}

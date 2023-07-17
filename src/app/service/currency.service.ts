import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CurrencySymbol } from '../main/currency.enum';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private url = 'https://api.exchangerate.host';
  private symbolsAfterComma = 4;

  constructor(private http: HttpClient) {}

  getExchangeRates(currency: string): Observable<any> {
    return this.http
      .get(
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

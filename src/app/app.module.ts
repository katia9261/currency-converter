import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './main/header/header.component';
import { CurrencyConverterComponent } from './main/currency-converter/currency-converter.component';
import { CurrencyService } from './service/currency.service';

@NgModule({
  declarations: [AppComponent, HeaderComponent, CurrencyConverterComponent],
  imports: [BrowserModule],
  providers: [CurrencyService],
  bootstrap: [AppComponent],
})
export class AppModule {}

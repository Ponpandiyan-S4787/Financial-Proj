import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat'
})
export class CurrencyFormatPipe implements PipeTransform {

  transform(value: number): string {
    // console.log( `$${value.toFixed(3)}`,value)
    return `$${value.toFixed(2)}`;
  }

}

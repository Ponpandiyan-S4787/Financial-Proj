import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appRestrictInput]'
})
export class RestrictInputDirective {

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: Event) {
    const input = this.el.nativeElement as HTMLInputElement;
    input.value = input.value.replace(/[^0-9.]/g, '');
  }

}

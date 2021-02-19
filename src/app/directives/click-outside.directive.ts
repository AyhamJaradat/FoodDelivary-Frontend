import {Directive, ElementRef, Output, EventEmitter, HostListener} from '@angular/core';

@Directive({
  selector: '[clickOutside]'
})
export class ClickOutsideDirective {

  constructor(private _elementRef : ElementRef) {
  }

  @Output()  public clickOutside = new EventEmitter();

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {
    console.log("click on document: directive");
      const clickedInside = this._elementRef.nativeElement.contains(targetElement);
      if (!clickedInside) {
        console.log("click outside: directive");
          this.clickOutside.emit(null);
      }
  }

}

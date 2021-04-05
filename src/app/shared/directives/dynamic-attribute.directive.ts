import { ElementRef, Directive, Input, Component, ViewContainerRef, Inject, Compiler, Renderer2 } from "@angular/core";
import { Observable } from "rxjs/Observable";
@Directive({
    selector: "[dynamicAttribute]",
    
  })
  export  class DynamicAttributeDirective {

    @Input()
    dynamicAttribute: any;
    constructor(public viewContainerRef: ViewContainerRef, private el: ElementRef,
                private renderer: Renderer2) {
      
     
    }

    ngOnChanges(changes: any) {        
        //this.el.nativeElement.attr("#"+this.dynamicAttribute.name, "matMenu");   
        this.renderer.setAttribute(this.el.nativeElement, this.dynamicAttribute, "matMenu");            
    }

  }
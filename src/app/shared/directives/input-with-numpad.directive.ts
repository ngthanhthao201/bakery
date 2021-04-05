

import { ElementRef, Directive, EventEmitter, Output, Optional, Input } from "@angular/core";
import { MatAutocompleteTrigger } from "@angular/material/autocomplete";
import { NgControl, NgModel, FormControl } from "@angular/forms";
declare var DocumentTouch: any;
declare var window: any;
import * as _ from 'lodash'

@Directive({
    selector: '[inputWithNumpad]',
    providers: [NgModel]
})

export class InputWithNumpadDirective {
    public styling = `<style>
    .inputWithNumpad-numpad-container{
        margin-left: -360px;
        position: absolute;
        margin-top: -100px;
        z-index: 1000;
        border: 3px solid rgb(102, 110, 232);

        // box-shadow: rgb(102, 110, 232) 2px 0px 20px;
    }
    .inputWithNumpad-numpad {
        width: 350px;
        height: 350px;
        display: flex;
        flex-flow: row wrap;
    }
    .inputWithNumpad-numpad-button {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1 0 33.3333%;
        background-color: #F9A03F;
        color: white;
        border: 1px solid rgba(255, 255, 255, .25);
        font-weight:bold;
        font-size: 42px;
    }
    .inputWithNumpad-numpad-button:hover {
        background-color: #f89426;
    }
    .inputWithNumpad-numpad-playground {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    </style>`;

    // observable: any;

    @Output() numberPressedChanged: EventEmitter<any> = new EventEmitter();
    @Input() customControl:FormControl;

     numberButtons = ['0','1','2','3','4','5','6','7','8','9','back','enter']

    currentNumberPadJquery: any;
    constructor(private el: ElementRef,
        private ngModel: NgModel,
        @Optional() private autoTrigger: MatAutocompleteTrigger,
        @Optional() private control: NgControl) {
            let that = this;


    };

    private inputUnfocus() {
        this.el.nativeElement.addEventListener('blur', () => {
            $(this.el.nativeElement).siblings('.inputWithNumpad-numpad-container').hide();
        });
    }

    private inputFocus() {
        var _this = this;
        this.el.nativeElement.addEventListener('focus', () => {
            $(_this.el.nativeElement).siblings('.inputWithNumpad-numpad-container').show();
        });
    }

    initNumberPad() {
        var numberPadHtml = `
            <div class="inputWithNumpad-numpad-container" style="display:none; position: fixed;">
                <div class="inputWithNumpad-numpad-playground">
                    <!-- All you need to play with -->
                    <div class="inputWithNumpad-numpad">
                        <div class="numberPressed1 inputWithNumpad-numpad-button">1</div>
                        <div class="numberPressed2 inputWithNumpad-numpad-button">2</div>
                        <div class="numberPressed3 inputWithNumpad-numpad-button">3</div>
                        <div class="numberPressed4 inputWithNumpad-numpad-button">4</div>
                        <div class="numberPressed5 inputWithNumpad-numpad-button">5</div>
                        <div class="numberPressed6 inputWithNumpad-numpad-button">6</div>
                        <div class="numberPressed7 inputWithNumpad-numpad-button">7</div>
                        <div class="numberPressed8 inputWithNumpad-numpad-button">8</div>
                        <div class="numberPressed9 inputWithNumpad-numpad-button">9</div>
                        <div class="numberPressedback inputWithNumpad-numpad-button">&larr;</div>
                        <div class="numberPressed0 inputWithNumpad-numpad-button">0</div>
                        <div class="numberPressedenter inputWithNumpad-numpad-button" >Enter</div>
                    </div>
                </div>
            </div>
        `;

        $('head').append(this.styling);
        $(numberPadHtml).insertBefore($(this.el.nativeElement));

        var buttonsContainer = $(this.el.nativeElement).siblings('.inputWithNumpad-numpad-container').children()[0].children[0];
        _.each(this.numberButtons, n=>{
            this.registerClickEvent(buttonsContainer, n)
        })

        return numberPadHtml;
    }

    private registerClickEvent(buttonsContainer: any, number: string) {
        $(buttonsContainer).children('.numberPressed'+number).on("mousedown", function (e) {
            e.preventDefault();
        }).on("click", () => {
            this.numberPressed(number);
            var control = this.customControl || this.ngModel.control;
            if(number =='back'){
                if((typeof control.value !== 'string')){
                    control.patchValue('');
                    return;
                }
                control.patchValue(control.value.toString().slice(0, -1));
                return;
            }

            if(number =='enter'){
                $(this.el.nativeElement).trigger(jQuery.Event('keydown', { which: 13 }));
                return;
            }

            control.patchValue((control.value || '') + number);


        });
    }

    ngOnInit() {
        // $('.numberPadInput').hide();
    }

    ngAfterViewInit() {
        var _this = this;
        window.addEventListener('touchstart', function onFirstTouch() {
            // we could use a class
            document.body.classList.add('user-is-touching');

            // or set some global variable
            window.USER_IS_TOUCHING = true;

            _this.initNumberPad();
            _this.inputFocus();
            _this.inputUnfocus();

            // or set your app's state however you normally would
            //myFrameworkOfChoice.dispatchEvent('USER_IS_TOUCHING', true);

            // we only need to know once that a human touched the screen, so we can stop listening now
            window.removeEventListener('touchstart', onFirstTouch, false);
        }, false);


    }

    numberPressed(num) {
        this.numberPressedChanged.emit(num);
    }

    // ngOnDestroy() {
    // this.observable.unsubscribe();
    // }



}


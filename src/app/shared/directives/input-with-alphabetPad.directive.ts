import { ElementRef, Directive, EventEmitter, Output, Optional, Input } from "@angular/core";
import { MatAutocompleteTrigger } from "@angular/material/autocomplete";
import { NgControl, NgModel, FormControl } from "@angular/forms";
declare var DocumentTouch: any;
declare var window: any;
import * as _ from 'lodash'

@Directive({
    selector: '[inputWithWordPad]',
    providers: [NgModel]
})
export class InputWithAlphabetPadDirective {

    // observable: any;
    @Output()
    keyWordPressedChanged: EventEmitter<any> = new EventEmitter();
    @Input() customControl:FormControl;
    wordButtons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
    'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Back', 'A','S','D','F','G','H','J','K','L','Enter','Z','X','C','V','B','N','M','Space'];
    constructor(private el: ElementRef, private ngModel: NgModel) {
    };

    private inputUnfocus() {
        this.el.nativeElement.addEventListener('blur', () => {
            $('#wordPad-keyboard').hide();
            // $("#wordPad-keyboard").fadeOut()
            // .animate({}, 800, function() {});
        });
    }

    private inputFocus() {
        var _this = this;
        this.el.nativeElement.addEventListener('focus', () => {
            $('#wordPad-keyboard').show();
            // $("#wordPad-keyboard").fadeIn()
            // .animate({}, 800, function() {
            //     //callback
            // });
        });
    }

    initWordPad() {
        var wordPadHtml = `
        <div id="wordPad-keyboard" class="row" style="display:none; position: fixed;">
            <div class="section-a">
            <!--<div class="wordPad-key keyWord~ wordPad-hidden">~</div>-->
                <div class="wordPad-key keyWord1">1</div>
                <div class="wordPad-key keyWord2">2</div>
                <div class="wordPad-key keyWord3">3</div>
                <div class="wordPad-key keyWord4">4</div>
                <div class="wordPad-key keyWord5">5</div>
                <div class="wordPad-key keyWord6">6</div>
                <div class="wordPad-key keyWord7">7</div>
                <div class="wordPad-key keyWord8">8</div>
                <div class="wordPad-key keyWord9">9</div>
                <div class="wordPad-key keyWord0">0</div>
                <!--<div class="wordPad-key keyWord- dual wordPad-hidden">_ -</div>
                    <div class="wordPad-key keyWord= dual wordPad-hidden">+ =</div>-->
                <div class="wordPad-key keyWordBack wordPad-backspace">&larr;</div>
                <!--END NUMBER KEYS -->

                <div class="wordPad-key wordPad-hidden" ></div>
                <div class="wordPad-key keyWordQ">q</div>
                <div class="wordPad-key keyWordW">w</div>
                <div class="wordPad-key keyWordE">e</div>
                <div class="wordPad-key keyWordR">r</div>
                <div class="wordPad-key keyWordT">t</div>
                <div class="wordPad-key keyWordY">y</div>
                <div class="wordPad-key keyWordU">u</div>
                <div class="wordPad-key keyWordI">i</div>
                <div class="wordPad-key keyWordO">o</div>
                <div class="wordPad-key keyWordP">p</div>
                <div class="wordPad-key keyWordEnter wordPad-enter">Enter</div>

                <div class="wordPad-key wordPad-hidden" ></div>
                <div class="wordPad-key wordPad-hidden" ></div>
                <div class="wordPad-key keyWordA">a</div>
                <div class="wordPad-key keyWordS">s</div>
                <div class="wordPad-key keyWordD">d</div>
                <div class="wordPad-key keyWordF">f</div>
                <div class="wordPad-key keyWordG">g</div>
                <div class="wordPad-key keyWordH">h</div>
                <div class="wordPad-key keyWordJ">j</div>
                <div class="wordPad-key keyWordK">k</div>
                <div class="wordPad-key keyWordL">l</div>

                <div class="wordPad-key wordPad-hidden" ></div>
                <div class="wordPad-key wordPad-hidden" ></div>
                <div class="wordPad-key wordPad-hidden" ></div>
                <div class="wordPad-key wordPad-hidden" ></div>
                <div class="wordPad-key wordPad-hidden" ></div>

                <div class="wordPad-key keyWordZ">z</div>
                <div class="wordPad-key keyWordX">x</div>
                <div class="wordPad-key keyWordC">c</div>
                <div class="wordPad-key keyWordV">v</div>
                <div class="wordPad-key keyWordB">b</div>
                <div class="wordPad-key keyWordN">n</div>
                <div class="wordPad-key keyWordM">m</div>

                <div class="wordPad-key wordPad-hidden" ></div>
                <div class="wordPad-key wordPad-hidden" ></div>
                <div class="wordPad-key wordPad-hidden" ></div>
                <div class="wordPad-key wordPad-hidden" ></div>
                <div class="wordPad-key wordPad-hidden" ></div>
                <div class="wordPad-key wordPad-hidden" ></div>
                <div class="wordPad-key wordPad-hidden" ></div>
                <div class="wordPad-key keyWordSpace wordPad-space">Space</div>
            </div>
            <!-- end section-a-->

        </div>
        `;

        $('body').append($(wordPadHtml));
        var buttonsContainer = $('#wordPad-keyboard').children()[0];

        $('#wordPad-keyboard').on("mousedown", function (e) {
            e.preventDefault();
        })

        _.each(this.wordButtons, w => {
            this.registerClickEvent(buttonsContainer, w);
        });
        return wordPadHtml;
    }

    private registerClickEvent(buttonsContainer: any, word: string) {
        $(buttonsContainer).children('.keyWord' + word).on("mousedown", function (e) {
            e.preventDefault();
        }).on("click", () => {
            if (!$(this.el.nativeElement).is(":focus")) {
                return;
              }
            this.wordPressed(word);
            console.log(word);
            var control = this.customControl || this.ngModel.control;
            if (word == 'Back') {
                if ((typeof control.value !== 'string')) {
                    control.patchValue('');
                    return;
                }
                control.patchValue(control.value.toString().slice(0, -1));
                return;
            }
            if (word == 'Space') {
                control.patchValue((control.value || '') + " "); //add space
                return;
            }
            if (word == 'Enter') {
                $(this.el.nativeElement).trigger(jQuery.Event('keydown', { which: 13 }));
                control.patchValue((control.value || '') + "\n"); //add space
                return;
            }

            control.patchValue((control.value || '') + word.toUpperCase());
        });
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        var _this = this;
        window.addEventListener('touchstart', function onFirstTouch() {
            // we could use a class
            document.body.classList.add('user-is-touching');
            // or set some global variable
            window.USER_IS_TOUCHING = true;
            _this.initWordPad();
            _this.inputFocus();
            _this.inputUnfocus();
            // or set your app's state however you normally would
            //myFrameworkOfChoice.dispatchEvent('USER_IS_TOUCHING', true);
            // we only need to know once that a human touched the screen, so we can stop listening now
            window.removeEventListener('touchstart', onFirstTouch, false);
        }, false);
    }

    wordPressed(w) {
        this.keyWordPressedChanged.emit(w);
    }
}



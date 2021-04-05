import {DOCUMENT} from '@angular/common';
import {Inject, Injectable, Renderer2, RendererFactory2} from '@angular/core';

/**
 * Service to use styles with directives
 * @dynamic
 */
@Injectable({
    providedIn: 'root',
})
export class DirectiveStylesService {
    private readonly renderer: Renderer2;

    constructor(
        @Inject(DOCUMENT) private readonly documentRef: Document,
        @Inject(RendererFactory2) rendererFactory: RendererFactory2,
    ) {
        // https://github.com/angular/angular/issues/17824#issuecomment-353239017
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    addStyle(styles: string, attribute: string) {
        if (this.documentRef.head.querySelector(`style[${attribute}]`)) {
            return;
        }

        const style = this.renderer.createElement('style');

        this.renderer.setProperty(style, 'textContent', styles);
        this.renderer.setAttribute(style, attribute, '');

        this.documentRef.head.appendChild(style);
    }
}
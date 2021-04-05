import { animate, state, style, transition, trigger } from '@angular/animations';

export function routerTransition() {
    return slideToTop();
}

export function componentTransition() {
    return slideToTop();
}

export function ordersTimelineTransition() {
    return slideToLeft();
}

export function touchScreenCheckoutTransition() {
    return trigger('touchScreenCheckoutTransition', [
        state('in', style({})),
        state('out', style({ height: '0%'})),
        transition('out => in', [
            style({ height: '0%'}),
            animate('0.5s ease-in-out', style({ height: '20%'}))
        ]),
        transition('in => out', [
            style({}),
            animate('0.5s ease-in-out', style({ height: '0%'}))
        ])
    ]);
}

export function slideToRight() {
    return trigger('routerTransition', [
        state('void', style({})),
        state('*', style({})),
        transition('out => in', [
            style({ transform: 'translateX(-100%)' }),
            animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))
        ]),
        transition('in => out', [
            style({ transform: 'translateX(0%)' }),
            animate('0.5s ease-in-out', style({ transform: 'translateX(100%)' }))
        ])
    ]);
}

export function slideToLeft() {
    return trigger('ordersTimelineTransition', [
        state('in', style({})),
        state('out', style({ width: '0%'})),
        transition('out => in', [
            style({ width: '0%'}),
            animate('0.5s ease-in-out', style({ width: '100%'}))
        ]),
        transition('in => out', [
            style({}),
            animate('0.5s ease-in-out', style({ width: '0%'}))
        ])
    ]);
}

export function slideToBottom() {
    return trigger('routerTransition', [
        state('void', style({})),
        state('*', style({})),
        transition(':enter', [
            style({ transform: 'translateY(-100%)' }),
            animate('0.5s ease-in-out', style({ transform: 'translateY(0%)' }))
        ]),
        transition(':leave', [
            style({ transform: 'translateY(0%)' }),
            animate('0.5s ease-in-out', style({ transform: 'translateY(100%)' }))
        ])
    ]);
}

export function slideToTop() {
    return trigger('routerTransition', [
        state('void', style({})),
        state('*', style({})),
        transition(':enter', [
            style({ transform: 'translateY(100%)' }),
            animate('0.5s ease-in-out', style({ transform: 'translateY(0%)' }))
        ]),
        transition(':leave', [
            style({ transform: 'translateY(0%)' }),
            animate('0.5s ease-in-out', style({ transform: 'translateY(-100%)' }))
        ])
    ]);
}

export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    badge: number;
    badgeClass: string;
    isExternalLink: boolean;
    submenu : RouteInfo[];
    requiredClaim?: string;
}

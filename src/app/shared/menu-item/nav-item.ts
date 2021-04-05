export interface NavItem {
    displayName: string;
    iconName: string;
    route?: string;
    children?: NavItem[];
    clickEvent?: ICallback;
    hoverEvent?: ICallback;
    data?:any;
    price?: number;
    image?: string;
    displayImage?:boolean;
  }
  
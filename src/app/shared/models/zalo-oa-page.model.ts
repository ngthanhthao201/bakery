import { ZaloOAPost } from "./zalo-oa-post.model";

export class ZaloOAPage {
    id: number;
    expiredTime: Date;
    name: string;
    accessToken: string;
    shopId: number;
    image: string;
    oaId: string;
    cover: string;
    description: string;

    zaloOAPosts: Array<ZaloOAPost>;
  }


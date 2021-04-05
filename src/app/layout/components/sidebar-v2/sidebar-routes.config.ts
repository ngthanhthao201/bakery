import { RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [

    {
        path: '/dashboard', title: 'Bán', icon: 'icon-screen-desktop', class: '', badge: 0, badgeClass: '', isExternalLink: false, submenu: []
    },
    {
        path: '' ,title: 'Đơn', icon: 'icon-grid', class: 'has-sub',badge: 0, badgeClass: 'badge badge-pill badge-danger float-right mr-3 mt-1', isExternalLink: false,
        submenu: [
            { path: '/orders', title: 'Đơn Bánh', icon: '', class: '',badge: 0, badgeClass: 'badge badge-pill badge-danger mt-1', isExternalLink: false, submenu: [] },
            { path: '/confirm-orders', title: 'Đơn Bánh Chờ Xác Nhận', icon: '', class: '',badge: 0, badgeClass: 'badge badge-pill badge-danger mt-1', isExternalLink: false, submenu: [] },
            { path: '/chats-facebook-messenger', title: 'Chat Facebook Messenger', icon: '', class: '',badge: 0, badgeClass: '', isExternalLink: false, submenu: [] },
            // { path: '/chats', title: 'Chat', icon: '', class: '',badge: 0, badgeClass: '', isExternalLink: false, submenu: [] }
        ]
    },
    {
        path: '', title: 'Nhập', icon: 'icon-layers', class: 'has-sub',badge: 0, badgeClass: 'badge badge-pill badge-danger float-right mr-3 mt-1', isExternalLink: false,
        submenu: [
            { path: '/input-product-barcode', title: 'Bánh Kem - Mã Vạch', icon: '', class: '',badge: 0, badgeClass: '', isExternalLink: false, submenu: [] },
            { path: '/input-product-barcode-handmade', title: 'Bánh Kem - Thủ Công', icon: '', class:'',badge: 0, badgeClass: '', isExternalLink: false, submenu: []},
            { path: '/product-barcode', title: 'Tình Trạng Bánh Kem', icon: '', class: '',badge: 0, badgeClass: '', isExternalLink: false, submenu: [] },
            { path: '/stuff-barcode', title: 'Bánh Nhỏ Phụ Kiện', icon: '', class: '',badge: 0, badgeClass: '', isExternalLink: false, submenu: [] },
        ]
    },
    {
        path: '', title: 'Báo cáo', icon: 'icon-eye', class: 'has-sub',badge: 0, badgeClass: 'badge badge-pill badge-danger float-right mr-3 mt-1', isExternalLink: false,
        submenu: [
            { path: '/financial', title: 'Sổ Thu Chi', icon: '', class: '',badge: 0, badgeClass: '', isExternalLink: false, submenu: [], requiredClaim: "shop.financial" },
            { path: '/customers', title: 'Khách Hàng', icon: '', class: '',badge: 0, badgeClass: '', isExternalLink: false, submenu: [] },
            { path: '/providers-warehouse', title: 'Nhà Cung Cấp', icon: '', class: '',badge: 0, badgeClass: '', isExternalLink: false, submenu: [] },
            { path: '/transaction-history', title: 'Lịch Sử Giao Dịch', icon: '', class: '',badge: 0, badgeClass: '', isExternalLink: false, submenu: [] },
            { path: '/daily-report', title: 'Báo Cáo Hàng Ngày', icon: '', class: '',badge: 0, badgeClass: '', isExternalLink: false, submenu: [] },
            { path: '/employees-report', title: 'KPI Nhân Viên', icon: '', class: '',badge: 0, badgeClass: '', isExternalLink: false, submenu: [] },
        ]
    },
    {
        path: '', title: 'Cài Đặt', icon: 'icon-settings', class: 'has-sub',badge: 0, badgeClass: 'badge badge-pill badge-danger float-right mr-3 mt-1', isExternalLink: false, requiredClaim: "shop.setting",
        submenu: [
            { path: '/showcase', title: 'Tủ Bánh', icon: '', class: '',badge: 0, badgeClass: '', isExternalLink: false, submenu: [] },
            { path: '/facebook', title: 'Facebook', icon: '', class: '',badge: 0, badgeClass: '', isExternalLink: false, submenu: [] },
            { path: '/zalo', title: 'Zalo', icon: '', class: '',badge: 0, badgeClass: '', isExternalLink: false, submenu: [] },
            { path: '/settings', title: 'Chung', icon: '', class: '',badge: 0, badgeClass: '', isExternalLink: false, submenu: [] },
        ]
    },
    {
        path: '', title: 'Nạp & Rút', icon: 'icon-support', class: 'has-sub',badge: 0, badgeClass: 'badge badge-pill badge-danger float-right mr-3 mt-1', isExternalLink: false,
        submenu: [
            { path: '/recharge', title: 'Nạp tiền', icon: '', class: '',badge: 0, badgeClass: '', isExternalLink: false, submenu: [] },
            { path: '/withdraw', title: 'Rút tiền', icon: '', class: '',badge: 0, badgeClass: '', isExternalLink: false, submenu: [] },
            // { path: '/assets/static/huong-dan.html', title: 'Hướng Dẫn', icon: '', class: '',badge: 0, badgeClass: '', isExternalLink: true, submenu: [] },
        ]
    },
];

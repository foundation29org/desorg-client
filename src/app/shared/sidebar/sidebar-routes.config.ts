import { RouteInfo } from './sidebar.metadata';

//Sidebar menu Routes and data
export const ROUTES: RouteInfo[] = [

    { path: '/home', title: 'menu.Dashboard', icon: 'ft-home', class: '', badge: '', badgeClass: 'badge rounded-pill badge-danger float-end me-1 mt-1', isExternalLink: false, submenu: [] },
    { path: '/privacy-policy', title: 'registration.Privacy Policy', icon: 'ft-shield', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
];

export const ROUTESHAVEDIAGNOSIS: RouteInfo[] = [

    { path: '/home', title: 'menu.Dashboard', icon: 'ft-home', class: '', badge: '', badgeClass: 'badge rounded-pill badge-danger float-end me-1 mt-1', isExternalLink: false, submenu: [] },
    { path: '/patient-info', title: 'menu.Basic Info', icon: 'ft-user', class: '', badge: '', badgeClass: 'badge rounded-pill badge-danger float-end me-1 mt-1', isExternalLink: false, submenu: [] },
    {
        path: '', title: 'menu.Personal Info', icon: 'fas fa-microscope', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
        submenu: [
            { path: '/symptoms', title: 'menu.Phenotype', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
            //{ path: '/genotype', title: 'menu.Genotype', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
            { path: '/seizures', title: 'menu.Seizures', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
            { path: '/medication', title: 'clinicalinfo.Medication', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
            { path: '/prom', title: 'menu.Questionnaire', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
        ]
    },
    { path: '/medical-records', title: 'menu.My documents', icon: 'fas fa-folder-open', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    { path: '/feel', title: 'homeraito.p6', icon: 'ft-heart', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    { path: '/mydata', title: 'mydata.title', icon: 'fas fa-archive', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    { path: '/pages/support', title: 'support.support', icon: 'ft-mail', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    { path: '/privacy-policy', title: 'registration.Privacy Policy', icon: 'ft-shield', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
];

//Sidebar menu Routes and data
export const ROUTESCLINICAL: RouteInfo[] = [

    { path: '/clinical/dashboard/home', title: 'diagnosis.Cases', icon: 'ft-users', class: '', badge: '', badgeClass: 'badge rounded-pill badge-danger float-end me-1 mt-1', isExternalLink: false, submenu: [] },
    { path: '/pages/support', title: 'support.support', icon: 'ft-mail', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    { path: '/clinical/about', title: 'about.title', icon: 'ft-book', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    { path: '/pages/profile', title: 'navbar.My Profile', icon: 'ft-edit', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //{ path: '/privacy-policy', title: 'registration.Privacy Policy', icon: 'ft-shield', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
];

//Sidebar menu Routes and data
export const ROUTESSUPERADMIN: RouteInfo[] = [

    { path: '/superadmin/dashboard-superadmin', title: 'menu.Dashboard Super Admin', icon: 'ft-home', class: '', badge: '', badgeClass: 'badge rounded-pill badge-danger float-end me-1 mt-1', isExternalLink: false, submenu: [] },
    { path: '/superadmin/langs', title: 'menu.Languages', icon: 'ft-flag', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    { path: '/superadmin/translations', title: 'menu.Translations', icon: 'ft-flag', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    { path: '/superadmin/diagnosis-super-admin', title: 'diagnosis.Diagnosis powered by genes', icon: 'ft-navigation', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    { path: '/superadmin/support', title: 'support.support', icon: 'ft-mail', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
];

//Sidebar menu Routes and data
export const ROUTESADMIN: RouteInfo[] = [

    { path: '/admin/community', title: 'do.community', icon: 'fa-solid fa-users', class: '', badge: '', badgeClass: 'badge rounded-pill badge-danger float-end me-1 mt-1', isExternalLink: false, submenu: [] },
    { path: '/admin/questionnaires', title: 'do.questionnaires', icon: 'fa-solid fa-circle-question', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    { path: '/admin/seizures', title: 'do.seizures', icon: 'fa-solid fa-bolt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    { path: '/admin/drugs', title: 'do.drugs', icon: 'fa-solid fa-pills', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    { path: '/admin/feels', title: 'do.quality', icon: 'fa-solid fa-face-grin', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    { path: '/admin/symptoms', title: 'do.symptoms', icon: 'fa-solid fa-crutch', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    { path: '/admin/datamanagement', title: 'do.datamanagement', icon: 'fa-solid fa-server', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
];

//Sidebar menu Routes and data
export const ROUTESHOMEDX: RouteInfo[] = [
    { path: '/.', title: 'Home', icon: 'icon-home', class: '', badge: '', badgeClass: 'badge rounded-pill badge-danger float-end me-1 mt-1', isExternalLink: false, submenu: [] },
    { path: '/aboutus', title: 'menu.About us', icon: 'fas fa-info', class: '', badge: '', badgeClass: 'badge rounded-pill badge-danger float-end me-1 mt-1', isExternalLink: false, submenu: [] },
    { path: 'https://www.foundation29.org/donate/', title: 'homedx.Donate', icon: 'fas fa-donate', class: '', badge: '', badgeClass: '', isExternalLink: true, submenu: [] },
];

const headerLink = document.querySelector('header .linkWrap a');
const headerLinkIcon = document.querySelector('header .linkWrap a path');
const homeLink = document.querySelector('.homeLink');
const managementLink = document.querySelector('.managementLink');
const windowLocateion = window.location.pathname;
if (window.location.pathname ==='/management/management.html' || window.location.pathname ==='/management/managementClass.html'|| window.location.pathname ==='/management/managementRoom.html'){
    managementLink.id='nowLink';
    homeLink.id ='';
}else if (window.location.pathname === '/main/main.html'){
    homeLink.id='nowLink';
    managementLink.id='';
}
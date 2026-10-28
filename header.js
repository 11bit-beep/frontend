const headerLink = document.querySelector('header .linkWrap a');
const headerLinkIcon = document.querySelector('header .linkWrap a path');
const homeLink = document.querySelector('.homeLink');
const managementLink = document.querySelector('.managementLink');
const windowLocateion = window.location.pathname;
if (window.location.pathname ==='/management/management.html' || window.location.pathname ==='/management/managementClass.html' || window.location.pathname ==='/management/managementRoom.html'){
    if (managementLink) managementLink.id='nowLink';
    if (homeLink) homeLink.id ='';
}else if (window.location.pathname === '/home/home.htm'){
    if (homeLink) homeLink.id='nowLink';
    if (managementLink) managementLink.id='';
}

// 로그아웃 시 - 로그인 토큰도 삭제
const logoutButton = document.querySelector('#logoutButton');
logoutButton?.addEventListener('click', () => {
    sessionStorage.removeItem('accessToken');
});

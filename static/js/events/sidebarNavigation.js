// sidebarNavigation.js
export function initSidebarNavigation() {
    const sidebarItems = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;
    
    sidebarItems.forEach(item => {
        if (item.getAttribute('href') === currentPath) {
            item.classList.add('active');
        }
    });

    sidebarItems.forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            sidebarItems.forEach(el => el.classList.remove('active'));
            this.classList.add('active');
            const targetHref = this.getAttribute('href');
            
            if (targetHref === '/ticket-offline') {
                window.location.href = '/ticket-offline';
            } else if (targetHref === '/ticket-online') {
                window.location.href = '/ticket-online';
            } else if (targetHref === '/ticket-reservation') {
                window.location.href = '/ticket-reservation';
            } else if (targetHref === '/auth/dashboard') {
                window.location.href = '/auth/dashboard';
            } else if (targetHref === '/auth/ticket-management') {
                window.location.href = '/auth/ticket-management';
            } else if (targetHref === '/auth/transaction-report') {
                window.location.href = '/auth/transaction-report';
            } else if (targetHref === '/auth/visitor-report') {
                window.location.href = '/auth/visitor-report';
            } else if (targetHref === '/auth/setting') {
                window.location.href = '/auth/setting';
            }
        });
    });

}
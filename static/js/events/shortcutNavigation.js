// shortcutNavigation.js
export function initKeyboardShortcuts() {
    document.addEventListener('keydown', function (e) {
        const isCtrlOrCmd = e.ctrlKey || e.metaKey;
        const key = e.key.toLowerCase();

        console.log(`Key: ${key}, Alt: ${e.altKey}, Ctrl: ${e.ctrlKey}, Meta: ${e.metaKey}`);


        // if (!isCtrlOrCmd) return;

        // switch (key) {
        //     case 'n':
        //         e.preventDefault();
        //         document.getElementById('menuTicketOffline')?.click();
        //         break;
        //     case 'o':
        //         e.preventDefault();
        //         document.getElementById('menuTicketOnline')?.click();
        //         break;
        //     case 'r':
        //         e.preventDefault();
        //         console.log('CTRL + R Pressed');
        //         document.getElementById('menuTicketReservation')?.click();
        //         break;
        //     case 'q':
        //         e.preventDefault();
        //         document.getElementById('menuKeluar')?.click();
        //         break;
        // }

        // Shortcuts with Ctrl or Command (⌘)
        if (isCtrlOrCmd) {
            switch (key) {
                case 'n':
                    e.preventDefault();
                    document.getElementById('menuTicketOffline')?.click();
                    break;
                case 'o':
                    e.preventDefault();
                    document.getElementById('menuTicketOnline')?.click();
                    break;
                case 'r':
                    e.preventDefault();
                    console.log('CTRL + R Pressed');
                    document.getElementById('menuTicketReservation')?.click();
                    break;
                case 'q':
                    e.preventDefault();
                    document.getElementById('menuKeluar')?.click();
                    break;
            }
        }

        // Use Alt
        if (e.altKey && key === 'r') {
            e.preventDefault();
            console.log('ALT/OPTION + R Pressed');
            document.getElementById('menuTicketReservation')?.click();
        }
    });
}
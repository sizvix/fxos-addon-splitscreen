SplitScreen = typeof SplitScreen === 'undefined' ? {
    originalResize: null,
    date: new Date()
} : SplitScreen;
console.log('**********************************\nSplit screen addon loaded\n' + SplitScreen.date + '\n**********************************');
// if (document.readyState === 'complete') {
//     console.log('document state is complete');
//         initialize();
// } else {
//     console.log('document is not ready');
//     window.addEventListener('load', () => {
//         console.log('now document state is complete');
//         initialize();
//     });
// }

const listeners = {
    appresize: {
        event: 'appresize',
        callback: function(event) {
            console.log('appresize');
            var appWindow = event.detail;

            console.log(appWindow.element.style);
            appWindow.element.style.height = Math.floor(appWindow.element.style.height.replace('px', '') / 2) + 'px';
            console.log(appWindow.element.style);
        }
    },
    enabledstatechange: {
        event: 'enabledstatechange',
        callback: function(event) {
            var app = event.application;
            if (app.manifestURL === 'app://fb7f8e93-a39a-490a-aeee-e6014509e060/manifest.webapp') {
                if (app.enabled) {
                    console.log('Split screen enabled');
                } else {
                    removeAddon();
                    console.log('Split screen disabled');
                }
            }
        }
    }
};

// Main
removeAddon(); // for testing - Ensures that previous deployed addons are removed
window.addEventListener(listeners.appresize.event, listeners.appresize.callback);
navigator.mozApps.mgmt.addEventListener('enabledstatechange', listeners.enabledstatechange.callback);

function removeAddon() {
    delete window.SplitScreen;
    for (key in listeners) {
        if (listeners.hasOwnProperty(key)) {
            let listener = listeners[key];
            console.log('clean listener on ' + listener.event);
            window.removeEventListener(listener.event, listener.callback);
        }
    }
}
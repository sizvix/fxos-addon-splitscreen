var app1 = null;
var app2 = null;
var homescreen;
var cslpre = '!-!';

SplitScreen = typeof SplitScreen === 'undefined' ? {
    originalResize: null,
    date: new Date()
} : SplitScreen;
console.log('**********************************\nSplit screen addon loaded\n' + SplitScreen.date + '\n**********************************');

if (document.readyState === 'complete') {
    console.log('document state is complete');
    homescreen = document.querySelector('#homescreen');
    console.log("on a le homescreen" + homescreen);
} else {
    console.log('document is not ready');
    window.addEventListener(listeners.load.event, listeners.load.callback);
}

const listeners = {
    load: {
        event: 'load',
        callback: function(event) {
            console.log('now document state is complete');
            homescreen = document.querySelector('#homescreen');
            console.log("on a le homescreen" + homescreen);
        }
    },
    appresize: {
        event: 'appresize',
        callback: function(event) {
            var appWindow = event.detail;
            console.log('appresize');
            console.log("on va gen_split", appWindow.element.style);
            gen_split(appWindow);
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
    },
    appwillclosed: {
        event: 'appwillclosed',//
        callback: function(event) {
            console.log(cslpre + ' on a appwillclose');
            if (!homescreen.classList.contains('active'))
                show2(app1, app2);
            else
                show1(null);
        }
    }
};

function gen_split(appWindow) {
    if (appWindow.element.id!="homescreen") {
        console.log(cslpre + ' on est pas dans le homescreen');
        let active = appWindow.element;// document.querySelector('#windows .active');
        if (app1 == null) {
            console.log(cslpre + ' on a pas encore une app');
            show2(active, null);
        } else {
            console.log(cslpre + ' on a déjà une app');
            show2(app1, active);
        }
    } else {
        console.log(cslpre + ' on retourne sur le home');
        show1(null);
    }
    console.log(cslpre + ' on a retaillé');
}

function show2(first, second) {
    app1 = first;
    if (first == null)
        first = homescreen;
    app2 = second;
    if (second == null)
        second = homescreen;
    console.log(cslpre + ' on va modif les css vers 2');
    if(first.classList.contains('inactive')){
        first.classList.remove('inactive');
        first.classList.add('active');
    }
    first.style.height = '50%';
    first.querySelector('.fade-overlay').style.display = 'none';
    first.querySelector('iframe').style.visibility = 'visible';
    first.style.transform = 'translate(0,0)';
    if(second.classList.contains('inactive')){
        second.classList.remove('inactive');
        second.classList.add('active');
    }
    second.style.height = '50%';
    second.style.transform = 'translate(0,100%)';
    second.querySelector('.fade-overlay').style.display = 'none';
    second.querySelector('iframe').style.visibility = 'visible';
}

function show1(first) {
    app1 = first;
    if (first == null)
        first = homescreen;
    app2 = null;
    console.log(cslpre + ' on va modif les css vers 1');
    first.style.transform = 'translate(0,0)';
    first.style.height = '100%';
    first.querySelector('.fade-overlay').style.display = 'none';
    first.querySelector('iframe').style.visibility = 'visible';
}


// Main
removeAddon(); // for testing - Ensures that previous deployed addons are removed
window.addEventListener(listeners.appresize.event, listeners.appresize.callback);
window.addEventListener(listeners.appwillclosed.event, listeners.appwillclosed.callback);
navigator.mozApps.mgmt.addEventListener('enabledstatechange', listeners.enabledstatechange.callback);

/*if(!homescreen.classList.contains('active')){
    console.log(cslpre+' homescreen pas actif !!!!!');
    var active = document.querySelector('#windows .active');
    show2(active,homescreen);
}*/

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


if (document.querySelector('.fxos-banner')) {
    // Already injected, abort.
    return;
} else {
    var body = document.querySelector('body');
    var fxosBanner = document.createElement('div');
    fxosBanner.classList.add('fxos-banner');
    var bannerText = document.createElement('p');
    var closeBtn = document.createElement('button');

    fxosBanner.appendChild(bannerText);
    fxosBanner.appendChild(closeBtn);
    body.appendChild(fxosBanner);

    closeBtn.textContent = 'X';
    bannerText.textContent = 'Wow, you have an extension installed!';

    closeBtn.onclick = function() {
        fxosBanner.parentNode.removeChild(fxosBanner);
    }
}
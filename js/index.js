console.log('Split screen addon loaded');
SplitScreen = {
    originalResize: null
};

if (window.AppWindow) {
    console.log('Split screen AppWindow already created');
    initialize(window.AppWindow);
}

window.addEventListener('appcreated', function(event) {
    console.log('Split screen AppWindow just created');
    initialize(event.detail);
});

navigator.mozApps.mgmt.addEventListener('enabledstatechange', function(event) {
    var app = event.application;
    if (app.manifestURL === 'app://fb7f8e93-a39a-490a-aeee-e6014509e060/manifest.webapp') {
        if (app.enabled) {
            console.log('Split screen enabled');
        } else {
            // TODO List all AppWindow and set the original _resize method
            //AppWindow.prototype._resize = SplitScreen.originalResize
            console.log('Split screen disabled');
        }
    }
});

function initialize(appWindow) {
    console.log('initialize');
    // if (!SplitScreen.originalResize) {
    //     SplitScreen.originalResize = appWindow._resize;
    // }
    console.log(appWindow);
    appWindow.prototype._resize = splitscreen_resize;
    console.log('Split screen AppWindow initialized');
}

function splitscreen_resize(ignoreKeyboard) {
    var height, width;
    this.debug('force RESIZE...');
    if (!ignoreKeyboard && Service.query('keyboardEnabled')) {
        /**
         * The event is dispatched on the app window only when keyboard is up.
         *
         * @access private
         * @event AppWindow~_withkeyboard
         */
        this.broadcast('withkeyboard');
    } else {
        /**
         * The event is dispatched on the app window only when keyboard is hidden.
         *
         * @access private
         * @event AppWindow~_withoutkeyboard
         */
        this.broadcast('withoutkeyboard');
    }
    height = Service.query('getHeightFor', this, ignoreKeyboard) || window.innerHeight;
    height = Math.floor(height / 2);

    // If we have sidebar in the future, change layoutManager then.
    width = Service.query('LayoutManager.width') || window.innerWidth;

    if (parseInt(this.element.style.width, 10) === (width | 0) &&
        parseInt(this.element.style.height, 10) === (height | 0)) {
        return;
    }

    this.width = width;
    this.height = height;

    this.element.style.width = width + 'px';
    this.element.style.height = height + 'px';

    this.reviveBrowser();

    this.resized = true;
    if (this.screenshotOverlay) {
        this.screenshotOverlay.style.visibility = '';
    }

    if (this.modalDialog && this.modalDialog.isVisible()) {
        this.modalDialog.updateMaxHeight();
    }

    /**
     * Fired when the app is resized.
     *
     * @event AppWindow#appresize
     */
    this.publish('resize');
    this.debug('W:', width, 'H:', height);

    return this.waitForNextPaint();
};
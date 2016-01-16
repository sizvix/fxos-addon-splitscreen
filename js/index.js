console.log('Split screen addon injected');

// If injecting into an app that was already running at the time
// the app was enabled, simply initialize it.
if (document.documentElement) {
    console.log('Split screen calls initialize');
    initialize();
}

// Otherwise, we need to wait for the DOM to be ready before
// starting initialization since add-ons are injected
// *before* `document.documentElement` is defined.
else {
    window.addEventListener('DOMContentLoaded', initialize);
}

function initialize() {
    if (document.querySelector('.fxos-banner')) {
        // Already injected, abort.
        return;
    } else {
        AppWindow.prototype._resize = function aw__resize(ignoreKeyboard) {
            var height, width;
            console.log('Resize me !!!!!');
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
            height = Service.query('getHeightFor', this, ignoreKeyboard) ||
                window.innerHeight;
            height = Math.floor(height / 2)

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


        }
    }
(function () {
    class FlyingDots {
        constructor(element, options) {
            let self = this;
            this._element = element;
            WinJS.UI.Fragments.render("./FlyingDots/FlyingDots.html", this._element).done(function () {
                if (options.showOnRender)
                    return self.show();
                self.hide();
            });
        }
        show() {
            return WinJS.UI.Animation.fadeIn(this._element);
        }
        hide() {
            return WinJS.UI.Animation.fadeOut(this._element);
        }
    }
    WinJS.Namespace.define("MajesticWaffle.UI", { FlyingDots: FlyingDots });
})();
WinJS.Utilities.markSupportedForProcessing(MajesticWaffle.UI.FlyingDots);

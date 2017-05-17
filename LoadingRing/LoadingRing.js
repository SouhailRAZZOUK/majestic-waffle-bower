(function () {
    class LoadingRing {
        constructor(element, options) {
            let self = this;
            this._element = element;
            WinJS.UI.Fragments.render("LoadingRing/LoadingRing.html", this._element).done(function () {
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
    WinJS.Namespace.define("MajesticWaffle.UI", { LoadingRing: LoadingRing });
})();
WinJS.Utilities.markSupportedForProcessing(MajesticWaffle.UI.LoadingRing);

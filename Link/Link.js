(function () {
    class Link {
        constructor(element, options) {
            let self = this;
            this._element = element;
            this._title = options.title;
            this._scenario = options.scenario;
            this._href = element.getAttribute("href") || options.href;
            if (this._title) {
                this._element.innerText = this._title;
            }
            // if there is a scenario object, href is not used
            if (this._scenario) {
                this._href = this._scenario.url;
            }
            this._element.addEventListener("click", function (event) {
                event.preventDefault();
                if (self._scenario) {
                    return MajesticWaffle.Navigation.navigate(self._scenario);
                }
                return WinJS.Navigation.navigate(self._href);
            });
        }
        get element() {
            return this._element;
        }
        get href() {
            return this._href;
        }
        get scenario() {
            return this._scenario;
        }
        dispose() {
        }
    }
    WinJS.Namespace.define("MajesticWaffle.UI", { Link: Link });
})();
WinJS.Utilities.markSupportedForProcessing(MajesticWaffle.UI.Link);

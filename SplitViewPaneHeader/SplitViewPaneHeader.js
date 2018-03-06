var MajesticWaffle;
(function (MajesticWaffle) {
    var UI;
    (function (UI) {
        class SplitViewPaneHeader {
            constructor(element, options) {
                let self = this;
                this.element = element;
                this._title = options.title;
                WinJS.UI.Fragments.render(MajesticWaffle.UI.controlsPath + "/SplitViewPaneHeader/SplitViewPaneHeader.html", this.element)
                    .done(function () {
                    let titleElement = WinJS.Utilities.query(".splitview-pane-header__title-area-container__title", self.element)[0];
                    let logoAreaElement = WinJS.Utilities.query(".splitview-pane-header__logo-area", self.element)[0];
                    titleElement.innerText = self.title;
                    self._logoArea = new MajesticWaffle.UI.SplitViewPaneHeaderIconButton(logoAreaElement, {});
                    self._logoArea.url = options.homeUrl || "/";
                    self._logoArea.icon = options.icon || "home";
                });
            }
            get title() {
                return this._title;
            }
            set title(value) {
                this._title = value;
            }
        }
        UI.SplitViewPaneHeader = SplitViewPaneHeader;
    })(UI = MajesticWaffle.UI || (MajesticWaffle.UI = {}));
})(MajesticWaffle || (MajesticWaffle = {}));
WinJS.Utilities.markSupportedForProcessing(MajesticWaffle.UI.SplitViewPaneHeader);

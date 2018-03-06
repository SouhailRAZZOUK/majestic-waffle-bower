var MajesticWaffle;
(function (MajesticWaffle) {
    var UI;
    (function (UI) {
        class SplitViewPaneHeaderIconButton {
            constructor(element, options) {
                this.element = element;
                this._generateElements();
                this.element.appendChild(this._iconContainer);
                this.element.appendChild(this._backButton);
                this.showIcon();
                this._wireUpEvents();
            }
            _generateElements() {
                this._iconContainer = document.createElement("a");
                WinJS.Utilities.addClass(this._iconContainer, "splitview-pane-header__logo-area__icon-container");
                this._iconContainer.href = "/";
                this._backButton = document.createElement("a");
                WinJS.Utilities.addClass(this._backButton, "splitview-pane-header__logo-area__navigation-button");
            }
            showIcon() {
                // WinJS.UI.Animation.fadeOut(this._backButton);
                return WinJS.UI.Animation.exitPage(this._backButton)
                    .then(() => {
                    WinJS.Utilities.addClass(this._backButton, "hidden");
                    WinJS.Utilities.removeClass(this._iconContainer, "hidden");
                    return WinJS.UI.Animation.fadeIn(this._iconContainer);
                });
            }
            showBackButton() {
                return WinJS.UI.Animation.fadeOut(this._iconContainer)
                    .then(() => {
                    // WinJS.UI.Animation.fadeIn(this._backButton);
                    WinJS.Utilities.addClass(this._iconContainer, "hidden");
                    WinJS.Utilities.removeClass(this._backButton, "hidden");
                    return WinJS.UI.Animation.enterPage(this._backButton);
                });
            }
            set icon(value) {
                let icon = WinJS.UI.AppBarIcon[value];
                if (icon) {
                    this._icon = icon;
                    this._iconContainer.textContent = icon;
                }
                else if (/url\S[\/\w+]\S/.test(value)) {
                    this._iconContainer.style.backgroundImage = value;
                }
                else if (value) {
                    WinJS.UI.Fragments.render(value, this._iconContainer);
                }
            }
            set url(value) {
                this._iconContainer.href = value;
            }
            _wireUpEvents() {
                let self = this;
                WinJS.Navigation.addEventListener("navigated", (event) => {
                    let url = event.detail.location;
                    let path = window.location.pathname;
                    if (WinJS.Navigation.history.backStack.length === 0) {
                        [...self._backButton.classList].some((className) => className === "hidden") ? null : self.showIcon();
                    }
                    else {
                        [...self._iconContainer.classList].some((className) => className === "hidden") ? null : self.showBackButton();
                    }
                });
                this._backButton.addEventListener("click", (event) => {
                    WinJS.Navigation.back();
                    event.preventDefault();
                });
            }
        }
        UI.SplitViewPaneHeaderIconButton = SplitViewPaneHeaderIconButton;
    })(UI = MajesticWaffle.UI || (MajesticWaffle.UI = {}));
})(MajesticWaffle || (MajesticWaffle = {}));

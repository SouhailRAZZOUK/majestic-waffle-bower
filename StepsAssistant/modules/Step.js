(function () {
    class Step {
        constructor(element, options) {
            this._element = element;
            this._title = options["title"];
            this._status = options["status"] || "hidden";
            this._entries = WinJS.Utilities.query("input, select", this._element) || new Array();
            this._showAnimation = options["showAnimation"] || "enterPage";
            this._hideAnimation = options["hideAnimation"] || "fadeOut";
            this._status = "hidden";
            if (this._title) {
                let title = document.createElement("h2");
                WinJS.Utilities.addClass(title, "win-h2");
                title.innerText = this._title;
                this._element.appendChild(title);
            }
        }
        get status() {
            return this._status;
        }
        get element() {
            return this._element;
        }
        hide() {
            let self = this;
            this._status = "hidden";
            return WinJS.UI.Animation.fadeOut(this._element).then(() => self._element.style.display = "none");
        }
        show() {
            let self = this;
            this._status = "shown";
            this._element.style.display = "block";
            return WinJS.UI.Animation.enterPage(this._element);
        }
        dispose() {
            return this._disposed = true;
        }
    }
    WinJS.Namespace.define("MajesticWaffle.UI", { Step: Step });
})();
WinJS.Utilities.markSupportedForProcessing(MajesticWaffle.UI.Step);

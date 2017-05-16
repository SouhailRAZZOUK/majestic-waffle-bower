(function () {
    class Alert {
        constructor(element, options) {
            let self = this;
            let textElement = document.createElement("p");
            let typePrefix = "mw-alert mw-alert-";
            let stack = document.getElementById("mw-alerts-stack");
            WinJS.Utilities.addClass(textElement, "text");
            this._element = element;
            this._text = options["text"];
            this._title = options["title"];
            this._type = options["type"];
            this._isInline = options["isInline"];
            this._duration = options["duration"] === undefined ? 5000 : options["duration"];
            if (!this._element) {
                this._element = document.createElement("div");
            }
            this._element.style.display = "none";
            WinJS.Utilities.addClass(this._element, typePrefix + this._type);
            if (!this._isInline) {
                stack.appendChild(this._element);
            }
            WinJS.UI.Fragments.render("/controls/Alert/Alert.html", this._element).done(function () {
                let contentElement = WinJS.Utilities.query(".content", self._element)[0];
                let closeSpan = document.createElement("span");
                self.closeButton = WinJS.Utilities.query("button.close", self._element)[0];
                if (self._title) {
                    let titleElement = document.createElement("h3");
                    WinJS.Utilities.addClass(titleElement, "win-h3");
                    titleElement.innerText = self._title;
                    contentElement.appendChild(titleElement);
                }
                closeSpan.innerText = WinJS.UI.AppBarIcon.cancel.toString();
                textElement.innerText = self._text;
                self.closeButton.appendChild(closeSpan);
                contentElement.appendChild(textElement);
                self._wireUpEvents();
                self.show();
            });
        }
        show() {
            let self = this;
            this._element.style.display = "block";
            if (this._duration > 0) {
                this._timer = setTimeout(function () {
                    self.close();
                }, self._duration);
            }
            return WinJS.UI.Animation.fadeIn(this._element);
        }
        hide() {
            let self = this;
            return WinJS.UI.Animation.fadeOut(this._element).then(function () {
                self._element.style.display = "none";
            });
        }
        close() {
            let self = this;
            let parentElement = this._element.parentElement;
            this.hide().done(function () {
                parentElement.removeChild(self._element);
                window.clearTimeout(self._timer);
            });
        }
        _wireUpEvents() {
            let self = this;
            this.closeButton.addEventListener("click", function () {
                self.close();
            });
        }
    }
    WinJS.Namespace.define("MajesticWaffle.UI", { Alert: Alert });
})();
WinJS.Utilities.markSupportedForProcessing(MajesticWaffle.UI.Alert);

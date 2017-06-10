(function () {
    class FilePicker {
        constructor(element, options) {
            let self = this;
            let multiple = options.multiple || false;
            this._element = element;
            WinJS.UI.Fragments.render(MajesticWaffle.UI.controlsPath + "/FilePicker/FilePicker.html", this._element).done(function () {
                self._fileInputElement = WinJS.Utilities.query(".mw-filepicker-input", self._element)[0];
                self._browseButtonElement = WinJS.Utilities.query(".mw-filepicker-button", self._element)[0];
                self._fileDropElement = WinJS.Utilities.query(".mw-filepicker", self._element)[0];
                multiple ? self._fileInputElement.setAttribute("multiple", "true") : null;
                self._fileInputElement.setAttribute("id", self._element.id + "_filepicker-input");
                self._browseButtonElement.setAttribute("for", self._fileInputElement.id);
                self._files = self._fileInputElement.files;
                self._wireUpEvents();
            });
            this._element.winControl = this;
        }
        updateBrowseButtonText() {
            let fileName = "";
            fileName = (this._files && this._files.length > 1) ? `${this._files.length} Files selected` : this._files[0].name;
            this._browseButtonElement.innerText = fileName ? fileName : "Choose a file...";
        }
        fileDragHover(e) {
            e.stopPropagation();
            e.preventDefault();
            (e.type === "dragover") ? this._fileDropElement.classList.add("hover") : this._fileDropElement.classList.remove("hover");
        }
        fileDropHandler(e) {
            e.stopPropagation();
            e.preventDefault();
            this.fileDragHover(e);
            this._files = e.dataTransfer.files;
            this.dispatchEvent("onchange");
        }
        addEventListener(name, listener, useCapture) {
            this._element.addEventListener(name, listener, useCapture);
        }
        removeEventListener(name) {
            this._element.removeEventListener(name);
        }
        dispatchEvent(name) {
            this._element.dispatchEvent(new Event(name));
        }
        _wireUpEvents() {
            let self = this;
            this.addEventListener("onchange", self.updateBrowseButtonText.bind(this));
            this._fileDropElement.addEventListener("dragover", this.fileDragHover.bind(this), false);
            this._fileDropElement.addEventListener("dragleave", this.fileDragHover.bind(this), false);
            this._fileDropElement.addEventListener("drop", this.fileDropHandler.bind(this), false);
            this._fileInputElement.addEventListener("focus", () => self._fileInputElement.classList.add("has-focus"));
            this._fileInputElement.addEventListener("blur", () => self._fileInputElement.classList.remove("has-focus"));
            this._fileInputElement.addEventListener("change", () => {
                self._files = self._fileInputElement.files;
                self.dispatchEvent("onchange");
            });
        }
    }
    WinJS.Namespace.define("MajesticWaffle.UI", { FilePicker: FilePicker });
})();
WinJS.Utilities.markSupportedForProcessing(MajesticWaffle.UI.FilePicker);

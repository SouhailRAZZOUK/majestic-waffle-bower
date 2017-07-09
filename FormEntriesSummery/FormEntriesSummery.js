(function () {
    class FormEntriesSummery {
        constructor(element, options) {
            let self = this;
            this._element = element;
            this._entries = options.entries || [];
            this._callbacks = options.callbacks || [];
            WinJS.UI.Fragments.render(MajesticWaffle.UI.controlsPath + "/FormEntriesSummery/FormEntriesSummery.html", this._element).done(function () {
                self._summeryElement = self._element.querySelector("#mw-summery-repeater");
                WinJS.UI.process(self._summeryElement).then(function () {
                    self._repeater = self._summeryElement.winControl;
                }).done(function () {
                    self.updateData();
                });
            });
        }
        set entries(entries) {
            this._entries = entries;
            this.updateData();
        }
        set callbacks(callbacks) {
            this._callbacks = callbacks;
            this.updateData();
        }
        updateData() {
            let self = this;
            this._repeater.data = new WinJS.Binding.List(self._entries.map((v) => {
                WinJS.Utilities.markSupportedForProcessing(self._callbacks[v.name]);
                return { key: v, callback: self._callbacks[v.name] };
            }));
        }
    }
    WinJS.Namespace.define("MajesticWaffle.UI", { FormEntriesSummery: FormEntriesSummery });
})();
WinJS.Utilities.markSupportedForProcessing(MajesticWaffle.UI.FormEntriesSummery);

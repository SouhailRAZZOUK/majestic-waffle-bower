(function () {
    class FormDropDown {
        constructor(element, options) {
            let self = this;
            let data = options.data || [];
            this._element = element;
            this._dataSource = new WinJS.Binding.List(data);
            WinJS.Utilities.addClass(this._element, "form-dropdown");
            WinJS.UI.Fragments.render("FormDropDown/FormDropDown.html", this._element).done(function () {
                self._selectElement = self._element.querySelector("select");
                WinJS.Utilities.addClass(self._selectElement, "win-dropdown");
                WinJS.UI.process(self._selectElement).then(function () {
                    self._repeater = self._selectElement.winControl;
                }).done(function () {
                    self._repeater.data = self._dataSource;
                });
                self._wireupEvents();
            });
            this._element.winControl = this;
        }
        get element() {
            return this._element;
        }
        get value() {
            return this._value;
        }
        get selectedIndex() {
            return this._selectedIndex;
        }
        getItem(index) {
            return this._repeater.data.getAt(index);
        }
        getItemByKey(key) {
            let item = this._repeater.data.getItemFromKey(key);
            return { key: item.key, value: item.data };
        }
        addItem(item) {
            return this._repeater.data.push(item);
        }
        removeItem(index) {
            return this._repeater.data.splice(index, 1);
        }
        _wireupEvents() {
            let self = this;
            this._selectElement.onchange = function () {
                self._value = self._selectElement.value;
                self._selectedIndex = self._selectElement.selectedIndex;
                self.onchange();
            };
        }
    }
    WinJS.Namespace.define("MajesticWaffle.UI", { FormDropDown: FormDropDown });
})();
WinJS.Utilities.markSupportedForProcessing(MajesticWaffle.UI.FormDropDown);

(function () {
    class FormInput {
        constructor(type, options) {
            this._type = type;
            this._dataOptions = options["dataOptions"] || {};
            this._name = options["name"];
            this._required = options["required"];
            this._isConfirm = options["isConfirm"];
            if (!this._isConfirm) {
                this._label = this.generateLabel(this._name);
            }
            this._hint = this.generateHint(options["hint"]);
            this._element = this.generateElement(this._type);
            this._wireupEvents();
        }
        get label() {
            return this._label;
        }
        get hint() {
            return this._hint;
        }
        get element() {
            return this._element;
        }
        get value() {
            return this._value;
        }
        generateLabel(labelText) {
            let labelElement = document.createElement("label");
            WinJS.Utilities.addClass(labelElement, "win-type-base");
            labelElement.innerText = MajesticWaffle.Utilities.capitalize(MajesticWaffle.Utilities.prettify(labelText));
            return labelElement;
        }
        generateHint(hintText) {
            let hintElement = document.createElement("label");
            WinJS.Utilities.addClass(hintElement, "form-hint");
            hintElement.innerText = hintText;
            hintElement.setAttribute("for", this._name);
            return hintElement;
        }
        generateElement(inputType) {
            let self = this;
            let element;
            let control;
            let cases = [
                {
                    case: ["text", "password", "email"],
                    callback: () => {
                        element = document.createElement("input");
                        WinJS.Utilities.addClass(element, "win-textbox");
                        element.setAttribute("id", this._name);
                        element.setAttribute("type", inputType);
                        (this._required) ? element.setAttribute("required", "true") : null;
                    }
                },
                {
                    case: "select",
                    callback: () => {
                        if (this._isConfirm)
                            return; // Can not be confirmed
                        element = document.createElement("select");
                        element.setAttribute("id", this._name);
                        WinJS.Utilities.addClass(element, "win-dropdown");
                    }
                },
                {
                    case: "MajesticWaffle.UI.FormDropDown",
                    callback: () => {
                        if (this._isConfirm)
                            return; // Can not be confirmed
                        element = document.createElement("div");
                        control = new MajesticWaffle.UI.FormDropDown(element, self._dataOptions);
                    }
                },
                {
                    case: "WinJS.UI.DatePicker",
                    callback: () => {
                        if (this._isConfirm)
                            return; // Can not be confirmed
                        element = document.createElement("div");
                        control = new WinJS.UI.DatePicker(element, self._dataOptions);
                    }
                },
                {
                    case: "WinJS.UI.TimePicker",
                    callback: () => {
                        if (this._isConfirm)
                            return; // Can not be confirmed
                        element = document.createElement("div");
                        control = new WinJS.UI.TimePicker(element, self._dataOptions);
                    }
                }
            ];
            MajesticWaffle.Utilities.switchcase(inputType, cases);
            return element;
        }
        _wireupEvents() {
            let self = this;
            let cases = [
                {
                    case: ["WinJS.UI.DatePicker", "WinJS.UI.TimePicker"],
                    callback: (machedCase) => {
                        let format = (machedCase === "WinJS.UI.DatePicker") ? "YYYY-MM-DD" : "YYYY-MM-DD hh:mm:ss";
                        return moment(self._element.winControl.current).utc().format(format);
                    }
                },
                {
                    case: "MajesticWaffle.UI.FormDropDown",
                    callback: () => self._element.winControl.value
                },
                {
                    case: "default",
                    callback: () => self._element.value
                }
            ];
            const onchange = () => {
                self._value = MajesticWaffle.Utilities.switchcase(self._type, cases);
                self.onchange();
            };
            (this._element.winControl) ? this._element.winControl.onchange = onchange : this._element.onchange = onchange;
        }
    }
    WinJS.Namespace.define("MajesticWaffle.UI", { FormInput: FormInput });
})();
WinJS.Utilities.markSupportedForProcessing(MajesticWaffle.UI.FormInput);

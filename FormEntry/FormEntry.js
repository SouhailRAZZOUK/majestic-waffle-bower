(function () {
    class FormEntry {
        constructor(element, options) {
            let self = this;
            let noConfirmInputTypes = ["select", "WinJS.UI.DatePicker", "WinJS.UI.TimePicker", "MajesticWaffle.UI.FormDropDown"];
            this._element = element;
            this._name = options["name"];
            this._type = options["type"];
            this._hint = options["hint"];
            this._validation = options["validation"];
            this._element.setAttribute("id", `${options["name"]}-entry`);
            WinJS.UI.Fragments.render("/controls/FormEntry/FormEntry.html", this._element).done(function () {
                self._input = new MajesticWaffle.UI.FormInput(self._type, {
                    dataOptions: options["dataOptions"] || {},
                    name: self._name,
                    hint: self._hint,
                    required: true,
                    isConfirm: false
                });
                if (options["confirm"] && !MajesticWaffle.Utilities.exists(self._type, noConfirmInputTypes))
                    self._confirm = new MajesticWaffle.UI.FormInput(self._type, {
                        name: `confirm-${self._name}`,
                        hint: `Re-enter the ${self._name}`,
                        required: true,
                        isConfirm: true
                    });
                if (self._validation) {
                    self._constraints = options["constraints"];
                    self._validator = new MajesticWaffle.UI.FormEntryValidator(self, self._validation, self._constraints);
                }
                self._wireupEvents();
                self.display();
            });
        }
        get element() {
            return this._element;
        }
        get input() {
            return this._input;
        }
        get name() {
            return this._name;
        }
        get confirm() {
            return this._confirm;
        }
        get value() {
            return this._value;
        }
        get validator() {
            return this._validator;
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
        displayInput() {
            this._element.appendChild(this._input.label);
            this._element.appendChild(this._input.hint);
            this._element.appendChild(this._input.element);
            if (this._validation) {
                this.validationMessages = this.generateValidationMessagesElement();
                this._element.appendChild(this.validationMessages);
            }
        }
        displayConfirm() {
            this._element.appendChild(this._confirm.hint);
            this._element.appendChild(this._confirm.element);
            this.confirmValidationMessages = this.generateValidationMessagesElement();
            this._element.appendChild(this.confirmValidationMessages);
        }
        display() {
            this.displayInput();
            if (this._confirm) {
                this.displayConfirm();
            }
        }
        generateValidationMessagesElement() {
            let validationMessagesElement = document.createElement("div");
            WinJS.Utilities.addClass(validationMessagesElement, "validation-messages");
            return validationMessagesElement;
        }
        _wireupEvents() {
            let self = this;
            this._input.onchange = function () {
                self._value = self._input.value;
                self.dispatchEvent("changed");
            };
            if (this._confirm) {
                this._confirm.onchange = function () {
                    self.dispatchEvent("confirmchanged");
                };
            }
        }
    }
    WinJS.Namespace.define("MajesticWaffle.UI", { FormEntry: FormEntry });
})();
WinJS.Utilities.markSupportedForProcessing(MajesticWaffle.UI.FormEntry);

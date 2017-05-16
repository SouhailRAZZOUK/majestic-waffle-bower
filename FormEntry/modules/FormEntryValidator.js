// End HACK
(function () {
    class FormEntryValidator {
        constructor(entry, validation, constraints, checkpoint) {
            this._entry = entry;
            this._constraints = constraints;
            this._validation = validation;
            this._wireupEvents();
        }
        generateValidationsMessagesElement() {
            let validationMessages = document.createElement("div");
            WinJS.Utilities.addClass(validationMessages, "validation-messages");
            this._entry.element.appendChild(validationMessages);
            return validationMessages;
        }
        validateInput() {
            let errors = new Array;
            errors = validate.single(this._entry.value, this._constraints);
            this._errors = errors;
            if (this._errors)
                return this._errors;
        }
        validateAsyncInput() {
            return validate.async(this._entry.value, this._constraints);
        }
        resetValidationMessages() {
            WinJS.Utilities.removeClass(this._entry.input.element, "has-error");
            WinJS.Utilities.empty(this._entry.validationMessages);
        }
        showValidationMessages(errors) {
            WinJS.Utilities.addClass(this._entry.input.element, "has-error");
            for (let error of errors) {
                let errorElement = document.createElement("p");
                WinJS.Utilities.addClass(errorElement, "error-message");
                error = (this._constraints.date) ? error : `${this._entry.name} ${error}`;
                errorElement.innerText = MajesticWaffle.Utilities.capitalize(error);
                this._entry.validationMessages.appendChild(errorElement);
            }
        }
        updateValidationMessages() {
            this.resetValidationMessages();
            if (this._errors) {
                this.showValidationMessages(this._errors);
            }
        }
        validateConfirm() {
            let confirmConstraints = { confirm: { presence: true, equality: { attribute: "input" } } };
            let confirmErrors = validate({ input: this._entry.value, confirm: this._entry.confirm.value }, confirmConstraints);
            this._confirmErrors = (confirmErrors) ? confirmErrors.confirm : null;
            return this._confirmErrors;
        }
        resetConfirmValidationMessages() {
            WinJS.Utilities.removeClass(this._entry.confirm.element, "has-error");
            WinJS.Utilities.empty(this._entry.confirmValidationMessages);
        }
        showConfirmValidationMessages(errors) {
            WinJS.Utilities.addClass(this._entry.confirm.element, "has-error");
            for (let error of errors) {
                let errorElement = document.createElement("p");
                WinJS.Utilities.addClass(errorElement, "error-message");
                errorElement.innerText = MajesticWaffle.Utilities.capitalize(error);
                this._entry.confirmValidationMessages.appendChild(errorElement);
            }
        }
        updateConfirmValidationMessages() {
            this.resetConfirmValidationMessages();
            if (this._confirmErrors) {
                this.showConfirmValidationMessages(this._confirmErrors);
            }
        }
        _wireupEvents() {
            let self = this;
            this._entry.addEventListener("changed", function () {
                self.validateInput();
                self.updateValidationMessages();
            });
            if (this._entry.confirm) {
                this._entry.addEventListener("confirmchanged", function () {
                    self.validateConfirm();
                    self.updateConfirmValidationMessages();
                });
            }
        }
    }
    WinJS.Namespace.define("MajesticWaffle.UI", { FormEntryValidator: FormEntryValidator });
})();
WinJS.Utilities.markSupportedForProcessing(MajesticWaffle.UI.FormEntryValidator);

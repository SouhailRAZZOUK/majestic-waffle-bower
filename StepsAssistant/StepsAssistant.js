(function () {
    class StepsAssistant {
        constructor(element, options) {
            this.onready = new Function;
            this.onsubmit = new Function;
            this.oncancel = new Function;
            let self = this;
            let commandsContainer = document.createElement("div");
            this._element = element;
            this._element.style.display = "none";
            this._nextCommand = document.createElement("button");
            this._events = new Array;
            this._finalCommands = this.createFinalCommands();
            this.onready = options["onready"];
            this.onsubmit = options["onsubmit"];
            this.oncancel = options["oncancel"];
            this._nextCommand.innerText = "Next";
            WinJS.Utilities.addClass(this._nextCommand, "win-button win-button-primary stepsassistant-nextcommand");
            this._element.appendChild(this._nextCommand);
            WinJS.Utilities.addClass(this._element, "stepsassistant-element");
            WinJS.Utilities.addClass(commandsContainer, "stepsassistant-commands");
            this._finalCommands.forEach(command => commandsContainer.appendChild(command));
            this._element.appendChild(commandsContainer);
            this.generateSteps();
            this._wireupEvents();
            WinJS.UI.Fragments.render("./StepsAssistant/StepsAssistant.html", this._element)
                .then(() => {
                self._progressElement = self._element.getElementsByClassName("progress")[0];
                WinJS.UI.process(self._progressElement);
            })
                .done(() => {
                self._element.style.display = "block";
                self._nextCommand.style.display = "inline-block";
                self._currentStep = self._steps[0];
                self.goToStep(0);
                self.dispatchEvent("ready");
            });
        }
        dispose() {
            if (this._disposed) {
                return;
            }
            this._disposed = true;
            let step;
            for (step in this._steps) {
                step.winControl.dispose();
            }
            this._steps = null;
            this._events.forEach((event) => self.removeEventListener(event));
        }
        addEventListener(name, listener, useCapture) {
            this._element.addEventListener(name, listener, useCapture);
            this._events.push(name);
        }
        removeEventListener(name) {
            this._element.removeEventListener(name);
            this._events = this._events.filter(ev => ev === name);
        }
        dispatchEvent(name) {
            this._element.dispatchEvent(new Event(name));
        }
        get element() {
            return this._element;
        }
        generateSteps(stepsElements) {
            let elements = stepsElements || Array.from(WinJS.Utilities.query(".step", this._element));
            this._steps = elements.map((elem) => new MajesticWaffle.UI.Step(elem, {}));
        }
        createFinalCommands() {
            let submitButton = document.createElement("button");
            let cancelButton = document.createElement("button");
            submitButton.innerText = "OK";
            cancelButton.innerText = "Cancel";
            WinJS.Utilities.addClass(submitButton, "win-button win-button-primary");
            WinJS.Utilities.addClass(cancelButton, "win-button");
            return [submitButton, cancelButton];
        }
        _wireupEvents() {
            let self = this;
            this._nextCommand.addEventListener("click", function () {
                self.nextStep();
            });
            this._finalCommands[0].addEventListener("click", function () {
                self.submit().done(() => {
                    self._progressElement.winControl.hide();
                    for (let command of self._finalCommands)
                        command.removeAttribute("disabled");
                });
            });
            this._finalCommands[1].addEventListener("click", function () {
                self.oncancel();
            });
            this.addEventListener("endreached", function () {
                self.updateCommands();
            });
            this.addEventListener("ready", function () {
                if (self.onready) {
                    self.onready();
                }
            });
        }
        goToStep(index) {
            let self = this;
            let promises = new Array();
            this._steps.forEach(function (step) {
                if (step.status === "shown") {
                    promises.push(step.hide());
                }
            });
            if (index === this._steps.length - 1) {
                this.dispatchEvent("endreached");
            }
            this._currentStep = this._steps[index];
            return (promises.length > 0) ? WinJS.Promise.thenEach(promises, function () {
                self._currentStep.show();
                self.updateCommands();
            }) : this._currentStep.show();
        }
        nextStep() {
            let self = this;
            let current = this._currentStep;
            let index = this._steps.findIndex(s => s === current);
            let next = index + 1;
            if (next < this._steps.length) {
                this._nextCommand.setAttribute("disabled", "true");
                this.goToStep(next).done(function () {
                    self._nextCommand.removeAttribute("disabled");
                });
            }
        }
        updateCommands() {
            let self = this;
            let current = this._steps.findIndex(s => s === self._currentStep);
            let isLast = current === this._steps.length - 1;
            if (isLast) {
                this._finalCommands.forEach(function (command) { command.style.display = "block"; });
                this._nextCommand.style.display = "none";
            }
            else {
                this._finalCommands.forEach(function (command) { command.style.display = "none"; });
                this._nextCommand.style.display = "block";
            }
        }
        submit() {
            let self = this;
            for (let command of this._finalCommands)
                command.setAttribute("disabled", "true");
            this._progressElement.winControl.show();
            const complete = () => {
                for (let command of self._finalCommands)
                    command.removeAttribute("disabled");
                self._progressElement.winControl.hide();
            };
            const error = () => {
                for (let command of self._finalCommands)
                    command.removeAttribute("disabled");
                self._progressElement.winControl.hide();
            };
            let submitPromise = function (complete, error, progress) {
                self.onsubmit();
            };
            return new WinJS.Promise((complete, error) => {
                self.onsubmit();
            });
        }
    }
    WinJS.Namespace.define("MajesticWaffle.UI", { StepsAssistant: StepsAssistant });
})();
WinJS.Utilities.markSupportedForProcessing(MajesticWaffle.UI.StepsAssistant);

var MajesticWaffle;
(function (MajesticWaffle) {
    var UI;
    (function (UI) {
        let WinJSUI = WinJS.UI;
        class SidePanel {
            constructor(element, options) {
                let self = this;
                this._element = element;
                let content = element ? element.innerHTML : null;
                this._commands = [];
                this._persistant = options.persistant || false;
                if (!this._element) {
                    this._element = document.createElement("div");
                    document.body.appendChild(this._element);
                }
                this.primaryAction = options.primaryAction;
                this.secondaryAction = options.secondaryAction;
                console.log(options);
                WinJS.Utilities.empty(this._element);
                WinJS.UI.Fragments.render(MajesticWaffle.UI.controlsPath + "/SidePanel/SidePanel.html", this._element)
                    .done(() => {
                    self._element.winControl = self;
                    WinJS.Utilities.addClass(this._element, "mw-sidepanel");
                    self.side = options.side || "right";
                    if (!self._persistant) {
                        self._dismissable = new WinJSUI._LightDismissService.LightDismissableElement({
                            element: this._element,
                            // tabIndex: -1,
                            onLightDismiss: () => {
                                self.hide();
                            },
                            onTakeFocus: () => {
                                self._dismissable.restoreFocus() || null;
                            }
                        });
                    }
                    self._contentEl = WinJS.Utilities.query(".mw-sidepanel__content-box", self._element)[0];
                    self._commandsEl = WinJS.Utilities.query(".mw-sidepanel__commands", self._element)[0];
                    self._generateCommands(options);
                    self._wireUpEvents(options);
                    self._contentEl.innerHTML = content;
                    self._element.winControl = self;
                });
            }
            set side(value) {
                this._side = value;
                for (let sideType of Object.keys(UI.SidePanelSides)) {
                    if (sideType !== value) {
                        WinJS.Utilities.removeClass(this._element, `mw-sidepanel--${sideType}`);
                    }
                }
                WinJS.Utilities.addClass(this._element, `mw-sidepanel--${value}`);
            }
            show() {
                WinJS.Utilities.addClass(this._element, "mw-sidepanel--open");
                if (!this._persistant) {
                    WinJSUI._LightDismissService.shown(this._dismissable);
                }
            }
            hide() {
                WinJS.Utilities.removeClass(this._element, "mw-sidepanel--open");
                if (!this._persistant) {
                    WinJSUI._LightDismissService.hidden(this._dismissable);
                }
            }
            _generateCommands(options) {
                if (typeof options.commands === "boolean") {
                    if (options.commands) {
                        let primaryCommand = document.createElement("button");
                        let secondaryCommand = document.createElement("button");
                        primaryCommand.innerText = "OK";
                        secondaryCommand.innerText = "Close";
                        WinJS.Utilities.addClass(primaryCommand, "win-button win-button-primary");
                        WinJS.Utilities.addClass(secondaryCommand, "win-button");
                        this._commands.push(primaryCommand, secondaryCommand);
                    }
                    else {
                        WinJS.Utilities.addClass(this._contentEl, "mw-sidepanel__content-box--full-height");
                    }
                }
                else if (options.commands === "primary") {
                    let primaryCommand = document.createElement("button");
                    primaryCommand.innerText = "OK";
                    WinJS.Utilities.addClass(primaryCommand, "win-button win-button-primary");
                    this._commands.push(primaryCommand);
                }
                else {
                    let primaryCommand = document.createElement("button");
                    primaryCommand.innerText = "Close";
                    WinJS.Utilities.addClass(primaryCommand, "win-button-primary");
                    this._commands.push(primaryCommand);
                }
                this._commands.map((command) => this._commandsEl.appendChild(command));
            }
            _wireUpEvents(options) {
                let self = this;
                if (typeof options.commands === "boolean") {
                    if (options.commands) {
                        this._commands[0].addEventListener("click", (event) => self.primaryAction ? self.primaryAction(event) : null);
                        this._commands[1].addEventListener("click", (event) => {
                            self.secondaryAction ? self.secondaryAction(event) : null;
                            self.hide();
                        });
                    }
                }
                else if (options.commands === "primary") {
                    this._commands[0].addEventListener("click", (event) => self.primaryAction ? self.primaryAction(event) : null);
                }
                else {
                    this._commands[0].addEventListener("click", (event) => self.hide());
                }
            }
        }
        UI.SidePanel = SidePanel;
    })(UI = MajesticWaffle.UI || (MajesticWaffle.UI = {}));
})(MajesticWaffle || (MajesticWaffle = {}));
WinJS.Utilities.markSupportedForProcessing(MajesticWaffle.UI.SidePanel);

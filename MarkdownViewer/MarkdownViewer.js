(function () {
    class MarkdownViewer {
        constructor(element, options) {
            let self = this;
            let fileXHR;
            this._element = element;
            this._url = options.url || "";
            this._markdownContent = options.markdown || "";
            WinJS.Utilities.addClass(this._element, "article-body");
            if (this._url) {
                fileXHR = WinJS.xhr({
                    type: "GET",
                    url: this._url,
                    responseType: "text",
                });
            }
            WinJS.UI.Fragments.render("MarkdownViewer/MarkdownViewer.html", this._element)
                .then(() => {
                self._viewer = WinJS.Utilities.query(".viewer", self._element)[0];
                return (fileXHR) ? fileXHR.then((result) => {
                    self._markdownContent = result.response;
                    self._HTMLContent = markdown.toHTML(self._markdownContent);
                }) : null;
            })
                .done(() => {
                self._viewer.innerHTML = self._HTMLContent || "";
                self.show();
            });
        }
        setContent(md) {
            this._HTMLContent = markdown.toHTML(md);
            this._viewer.innerHTML = this._HTMLContent;
            this.show();
        }
        show() {
            return WinJS.UI.Animation.enterContent(this._element);
        }
        hide() {
            return WinJS.UI.Animation.exitContent(this._element);
        }
    }
    WinJS.Namespace.define("MajesticWaffle.UI", { MarkdownViewer: MarkdownViewer });
})();
WinJS.Utilities.markSupportedForProcessing(MajesticWaffle.UI.MarkdownViewer);

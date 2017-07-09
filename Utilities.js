(function () {
    let underage;
    underage = moment().subtract(18, "years").utc();
    const generateUUID = () => {
        let d = new Date().getTime();
        if (window.performance && typeof window.performance.now === "function") {
            d += performance.now();
        }
        let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    };
    const capitalize = (str) => (typeof str === "string") ? str[0].toUpperCase() + str.slice(1) : str;
    const prettify = (str) => {
        if (validate.isNumber(str)) {
            // If there are more than 2 decimals round it to two
            if ((str * 100) % 1 === 0) {
                return "" + str;
            }
            else {
                return parseFloat(Math.round(str * 100) / 100).toFixed(2);
            }
        }
        if (validate.isArray(str)) {
            return str.map(function (s) { return MajesticWaffle.Utilities.prettify(s); }).join(", ");
        }
        if (validate.isObject(str)) {
            return str.toString();
        }
        // Ensure the string is actually a string
        str = "" + str;
        return str
            .replace(/([^\s])\.([^\s])/g, "$1 $2")
            .replace(/\\+/g, "")
            .replace(/[_-]/g, " ")
            .replace(/([a-z])([A-Z])/g, function (m0, m1, m2) {
            return "" + m1 + " " + m2.toLowerCase();
        })
            .toLowerCase();
    };
    const exists = (item, collection) => collection.find((value) => value === item) !== undefined;
    const validateEntries = (entries) => {
        let errors = new Array();
        for (let entry of entries) {
            let validation = [];
            validation = (entry.validator) ? entry.validator.validateInput() : undefined;
            errors.push(validation);
        }
        return errors;
    };
    const containsError = (errors) => {
        return errors.some((value) => value !== undefined);
    };
    const switchcaseMapMaker = (cases) => new Map(cases.map((v) => [v.case, v.callback]));
    const getCaseCallback = (key, cases) => {
        let c;
        for (let k of cases.keys())
            c = (k instanceof Array) && exists(key, k) ? cases.get(k) :
                (k === key) ? cases.get(k) :
                    (cases.get("default") && c === undefined) ? cases.get("default")
                        : c;
        return c;
    };
    const switchcase = (key, cases) => {
        let casesMap = switchcaseMapMaker(cases);
        let callback = getCaseCallback(key, casesMap);
        return (callback instanceof Function) ? callback(key) : callback;
    };
    WinJS.Namespace.define("MajesticWaffle", {
        UI: {
            controlsPath: "/bower_components/majestic-waffle"
        },
        Utilities: {
            generateUUID: generateUUID,
            underage: underage,
            exists: exists,
            capitalize: capitalize,
            prettify: prettify,
            validateEntries: validateEntries,
            containsError: containsError,
            switchcase: switchcase
        }
    });
})();

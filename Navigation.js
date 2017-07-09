(function () {
    const navigate = (scenario, state) => {
        document.title = scenario.title;
        MajesticWaffle.Navigation.scenario = scenario;
        return WinJS.Navigation.navigate(scenario.url, scenario.state || state || {});
    };
    WinJS.Namespace.define("MajesticWaffle.Navigation", {
        navigate: navigate,
        state: () => WinJS.Navigation.state,
        location: () => WinJS.Navigation.location,
        scenario: {}
    });
})();

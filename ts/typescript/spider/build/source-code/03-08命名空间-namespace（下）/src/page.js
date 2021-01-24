"use strict";
///<reference path="components.ts" />
var Home;
(function (Home) {
    var Dell;
    (function (Dell) {
        Dell.teacher = {
            name: 'dell'
        };
    })(Dell = Home.Dell || (Home.Dell = {}));
    var Page = /** @class */ (function () {
        function Page() {
            new Components.Header();
            new Components.Content();
            new Components.Footer();
            new Components.Footer();
        }
        return Page;
    }());
    Home.Page = Page;
})(Home || (Home = {}));

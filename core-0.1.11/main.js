(function() {

var ver = 'core-0.1.11';//version provided via grunt builds - this var will be replaced to actual value
var agoModule = undefined;//module name and
var agoVer = undefined;   //version (provided only on module build, so, optional)
var versionedModule = ver + '/module';
var versionedTheme = ver + '/themes/flatty/theme';

require.config({
	paths: {
		'css': versionedModule,
		'i18n': versionedModule,

		'jquery': versionedModule,
		'angular': versionedModule,

        'core/module': versionedModule,
        'core/common/calendar/module': versionedModule,
        'modernizr': versionedModule,

		'core/nls/ru/bootstrap_datepicker': versionedModule,
		'core/nls/en/bootstrap_datepicker': versionedModule,

		'core/nls/en/angular': versionedModule,
		'core/nls/ru/angular': versionedModule,

		'core/nls/ru/moment': versionedModule,

		'core/nls/en/module': versionedModule,
		'core/nls/ru/module': versionedModule
	}
});

if (typeof(agoModule) !== 'undefined') {
    var paths = {};
    var agoVersionedModule = agoVer + '/module';
    paths[agoModule + '/module'] = agoVersionedModule;
    paths[agoModule + '/nls/en/module'] = agoVersionedModule;
    paths[agoModule + '/nls/ru/module'] = agoVersionedModule;
    require.config({ paths: paths });
}

require(['jquery'], function ($) {
    require(['jquery-ui'], function() {
        //https://github.com/twbs/bootstrap/issues/6303
        // handle jQuery plugin naming conflict between jQuery UI and Bootstrap
        jQuery.widget.bridge('uibutton', jQuery.ui.button);
        jQuery.widget.bridge('uitooltip', jQuery.ui.tooltip);

        require(['angular', 'core/module', 'core/common/calendar/module', 'modernizr', versionedTheme],
        function (angular, coreModule, calendarModule, modernizr) {

            $('#reconnect').on('click', 'button', function () {
                $(this).parent().hide();
                reconnect();
            });

            var reconnect = function () {
                if (navigator.onLine) {
                    bootstrap();
                } else {
                    $('#reconnect').show();
                }
            };

            var bootstrap = function () {
                var $body = $('body');
                var modules = [coreModule.name, calendarModule.name];
                if (typeof(agoModule) !== 'undefined') {
                    require([agoModule + '/module'], function(module) {
                        modules.push(module.name);
                        angular.bootstrap($body, modules);
                    });
                } else {
                    angular.bootstrap($body, modules);
                }

                $body.removeClass('progrecss green');

                // iOS FIXED FIX
                var iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
                if (iOS && modernizr.touch) {
                    $(document).on('focus', 'input, textarea', function (e) {
                        $body.addClass('fixfixed');
                        setTimeout(function () {
                            $(document).scrollTop($(this).scrollTop());
                        }, 0);
                    });
                    $(document).on('blur', 'input, textarea', function (e) {
                        var $activeElm = $(window.document.activeElement);
                        if (!$activeElm.is('input') && !$activeElm.is('textarea')) {
                            $body.removeClass('fixfixed');
                            setTimeout(function () {
                                $(document).scrollTop($(this).scrollTop());
                            }, 0);
                        }
                    });
                }
            };

            reconnect();
        });
    });
});

})();

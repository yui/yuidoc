// Quick and dirty platform/os sniff, used only to influence non-critical
// design elements in CSS.
(function () {
    var ua       = navigator.userAgent,
        os       = '',
        platform = '';

    if (/windows/i.test(ua)) {
        platform = 'pc';
        os       = 'win';
    } else if (/macintosh/i.test(ua)) {
        platform = 'mac';
        os       = 'osx';
    } else if (/ios/i.test(ua)) {
        os = 'ios';

        if (/(?:iphone|ipod)/i.test(ua)) {
            platform = 'iphone mac';
        } else if (/ipad/i.test(ua)) {
            platform = 'ipad mac';
        }
    } else if (/linux/i.test(ua)) {
        if (/android/i.test(ua)) {
            platform = 'android pc';
        } else {
            platform = 'pc';
        }

        os = 'linux';
    }

    document.documentElement.className += ' ' + platform + ' ' + os;
}());

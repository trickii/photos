"use strict";

const Translator = {
    locale: 'de',
    translation: ppDataTranslations,
    translate: function (key) {
        return Translator.translation[Translator.locale][key];
    },
    translateAll: function () {
        document.querySelectorAll('[data-t]').forEach((el) => {
            const key = el.getAttribute('data-t');
            el.innerHTML = Translator.translate(key);
        });
    },
    setLocale: function (locale) {
        Translator.locale = locale;
    }
}

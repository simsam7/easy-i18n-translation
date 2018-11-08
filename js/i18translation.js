var i18n = {
    showMissing: false,
    exportJSON: true,
    data: {},
    filter: "",
    getLanguageTranslation: function (path) {
        // The JSONP language translation file must have a callback of 'i18n.translate' or alter it here
        console.time("i18nAjaxRetrievalTime");
        try {
            $.ajax({
                url: path + "?callback=i18n.translate",
                dataType: "jsonp"
            });
        } catch (err) {
            console.error(err);
        }
        console.timeEnd("i18nAjaxRetrievalTime");
    },
// This translate function comes from the 'callback=i18nTranslation.translate' ajax call
    translate: function (data) {
        // Get JSON data in lang object and set ln to page language
        var ln = document.documentElement.lang;

        // Check if the specified language exists in the JSON language file
        if (data[ln]) {
            try {
                // Capture missing translations
                console.time("i18nTranslationTime");
                var missing = '';
                // Iterate through each data-i18n element found
                $(i18n.filter + '[data-i18n]').each(function () {
                    // Get the key
                    var i18d = $(this).data('i18n');
                    try {
                        // Match the key and replace the html/text
                        $(i18n.filter + '[data-i18n="' + i18d + '"]').html(data[ln][i18d]);
                        $(i18n.filter + '[data-i18n="' + i18d + '"]').attr('placeholder', (data[ln][i18d]));
                        if ((i18n.showMissing) && (!data[ln][i18d])) {
                            if (missing.indexOf('"' + i18d + '"') == -1) {
                                missing += '\n"' + i18d + '": "' + $('[data-i18n="' + i18d + '"]').text() + '",';
                            }
                        }
                    } catch (err) {
                        console.log(err);
                    }
                });
                if (missing != '') {
                    // Make easy to edit list of missing translations
                    console.log('Missing translation: ' + missing);
                }
                // Make JSON object available
                if (i18n.exportJSON) {
                    i18n.data = data;
                }
            } catch (err) {
                console.error(err);
            }
        }
        console.timeEnd("i18nTranslationTime");
        // Reset filter back to empty
        i18n.filter = "";
    }
};
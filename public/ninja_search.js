/*
 * ninja-search-js main file
 */
function toggle_flexfield(selectId){
    var selectField = $('#' + selectId);
    var flexField = $('input#' + selectId + '_flexselect');
    if (flexField.size() == 0) {
        var selectOuterWidth = selectField.outerWidth(true);
        selectField.flexselect();
        var flexField = $('input#' + selectId + '_flexselect');
        flexOuterWidth= flexField.outerWidth(true);
        flexwidth = flexField.width() - (flexOuterWidth - selectOuterWidth);
        flexField.width( flexwidth ).click().val('').focus();
    } else {
        flexField.remove();
        $('#' + selectId + '_flexselect_dropdown').remove();
        selectField.show();
    }
}

function apply_ninja() { $('select').each(function(index) {
    if ($(this).find("option").size() <= 11) return true;
    if (! $(this).is(':visible')) return true;
    if ($(this).hasClass("ninja_search_activation")) return true;
    $(this).addClass("ninja_search_activation")

    // if <select> has no id attribute, then give it one based on name attribute
    var id = $(this).attr('id');
    if (id == null || id.length == 0 || $('select[id=' + id + ']').size() > 1) {
        if (id == null || id.length == 0) {
            baseid = 'ninja_search';
        } 
        else {
            baseid = id
        }
        id = baseid
        var uniqueCounter = 0;
        while ($('select[id=' + id + ']').size() > 0) {
            uniqueCounter += 1;
            id = baseid + "-" + uniqueCounter;
        }
        $(this).attr('id', id);
    }

    // create the Ninja Search button, with rel attribute referencing
    // corresponding <select id="...">
    if ($('a.ninja_search_activation[rel="' + id + '"]').size() === 0) {
        var btn_margin = $(this).parent().width() - $(this).outerWidth(true) - 3
        btn = $('<a class="ninja_search_activation" rel="' + id + '">ninja search</a>')
                       .insertAfter($(this))

        if ( btn_margin < btn.outerWidth() ) {
            $(this).width( $(this).width() - btn.outerWidth() );
        }

        // register onclick handler
        btn.click(function(event) {
            var selectId = $(this).attr('rel');
            toggle_flexfield(selectId);
        });

        // Press '/' (search in Vim) key also activates flexfield.
        $(this).keydown(function(e){
            switch (e.keyCode) {
                case 191: // '/' key
                    toggle_flexfield( $(this).attr('id') );
                    break;
            }
            return false;
        })
    }
}); return false; }

var PreventCascadingDetection = false;
function OnDomChanged () {
    PreventCascadingDetection = true;
    apply_ninja();
    PreventCascadingDetection = false;
}

var DOMChangeTimer = null;
function OnDomChangedWrapper (e) {
    if (!PreventCascadingDetection) {
        if (typeof DOMChangeTimer == "number") {
            clearTimeout (DOMChangeTimer);
            DOMChangeTimer = null;
        }
        DOMChangeTimer = setTimeout(OnDomChanged, 30);
    }
}

//for static contents
$("html").bind("DOMSubtreeModified", OnDomChangedWrapper);
//for dynamic contents
$(function(){ apply_ninja(); })(jQuery);

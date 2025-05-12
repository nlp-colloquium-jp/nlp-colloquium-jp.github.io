$(document).ready(function(){
    function toBoolean(booleanStr) {
        if (booleanStr === null) {
            return false
        }
        return booleanStr.toLowerCase() === "true";
    }

    const entries = window.performance.getEntriesByType('navigation')
    var isBrowserBackUsed = false;
    var isExpandedPrev = toBoolean(sessionStorage.getItem('isExpanded'));

    for (const entry of entries) {
        if (["back_forward", "reload"].includes(entry.type)) {
            isBrowserBackUsed = true;
        }
    }

    if (isBrowserBackUsed && isExpandedPrev) {
        $(".hidden-row").show();
        $(".expand-button-row").hide();
    } else {
        $(".hidden-row").hide();
        $(".expand-button-row").show();
        sessionStorage.setItem('isExpanded', 'false');
    };

    $("#show-more-btn").click(function(){
        $(".hidden-row").show();
        $(this).hide();
        $(".expand-button-row").hide();
        sessionStorage.setItem('isExpanded', 'true');
    });
});
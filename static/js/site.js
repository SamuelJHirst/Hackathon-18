$(document).delegate("#search", "click", function() {
    var query = $("#search-text").val();

    $.post("/product/search/", {
        query: query
    }, function(resp) {
        window.location = "/search/";
    });
});
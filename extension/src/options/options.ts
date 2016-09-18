/// <reference path='../typings/index.d.ts' />

$(document).ready(function() {
    $("#option-tabs a").click(function (event) {
        event.preventDefault()
        $(this).tab("show")

        // Store the currently selected tab in the hash value
        var id = $(event.target).attr("href").substr(1);
        window.location.hash = id;
    });

    var hash = window.location.hash;
    $('#option-tabs a[href="' + hash + '"]').tab('show');
});

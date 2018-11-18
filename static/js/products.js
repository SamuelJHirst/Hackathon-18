$(document).delegate("#clear", "click", function() {
    $("#ean").val("");
    $("#name").val("");
    $("#description").val("");
    $("#price").val("");
    $("#image").val("");
});

$(document).delegate("#submit", "click", function() {
    var ean = $("#ean").val(),
        name = $("#name").val(),
        description = $("#description").val(),
        price = $("#price").val();

    if (!ean) {
        $("#ean").addClass("is-invalid");
    }
    if (!name) {
        $("#name").addClass("is-invalid");
    }
    if (!description) {
        $("#description").addClass("is-invalid");
    }
    if (!price) {
        $("#price").addClass("is-invalid");
    }

    if (ean && name && description && price) {
        $.post("/product/add/", {
            id: ean,
            ean: ean,
            name: name,
            description: description,
            price: price
        }, function(resp) {
            $("#listing").append(resp);
            $("#add").modal("hide");
            $("#ean").val("");
            $("#name").val("");
            $("#description").val("");
            $("#price").val("");
            $("#image").val("");
        });
    }
    else {
        setTimeout(function() {
            $("#ean").removeClass("is-invalid");
            $("#name").removeClass("is-invalid");
            $("#description").removeClass("is-invalid");
            $("#price").removeClass("is-invalid");
        }, 3000);
    } 
});

$(document).delegate("#complete", "click", function() {
    var ean = $(this).data("ean"),
        name = $("#edit-name").val(),
        description = $("#edit-description").val(),
        price = $("#edit-price").val();

    if (!name) {
        $("#edit-name").addClass("is-invalid");
    }
    if (!description) {
        $("#edit-description").addClass("is-invalid");
    }
    if (!price) {
        $("#edit-price").addClass("is-invalid");
    }
    
    if (name && description && price) {
        $.post("/product/edit/", {
            id: ean,
            ean: ean,
            name: name,
            description: description,
            price: price
        }, function(resp) {
            $("#product-" + ean).replaceWith(resp);
            $("#edit").modal("hide");
            $("#edit-ean").val("");
            $("#edit-name").val("");
            $("#edit-description").val("");
            $("#edit-price").val("");
            $("#edit-image").val("");
        });
    }
    else {
        setTimeout(function() {
            $("#edit-name").removeClass("is-invalid");
            $("#edit-description").removeClass("is-invalid");
            $("#edit-price").removeClass("is-invalid");
        }, 3000);
    } 
});

$(document).delegate("#product-edit", "click", function() {
    var ean = $(this).data("ean");

    $.post("/product/get/", {
        ean: ean
    }, function(resp) {
        $("#edit-ean").val(resp.ean);
        $("#edit-name").val(resp.name);
        $("#edit-description").val(resp.description);
        $("#edit-price").val(resp.price);
        $("#complete").data("ean", resp.ean);
        $("#edit").modal("show");
    });
});

$(document).delegate("#product-status", "click", function() {
    var ean = $(this).data("ean");

    $.post("/product/status/", {
        ean: ean
    }, function(resp) {
        $("#product-" + ean).replaceWith(resp);
    });
});

$(document).delegate("#product-delete", "click", function() {
    var ean = $(this).data("ean");

    $.post("/product/delete/", {
        ean: ean
    }, function(resp) {
        $("#product-" + ean).remove();
    });
});
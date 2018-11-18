$(document).delegate("#login", "click", function() {
    $.post("/auth/", {
        username: $("#username").val(),
        password: $("#password").val()
    }, function(resp) {
        if (resp.auth === true) {
            location.reload();
        }
        else {
            $("#username").addClass("is-invalid");
            $("#password").addClass("is-invalid");
            setTimeout(function() {
                $("#username").removeClass("is-invalid");
                $("#password").removeClass("is-invalid");
            }, 3000)
        }
    });
});
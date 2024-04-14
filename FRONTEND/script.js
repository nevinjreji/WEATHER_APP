
//event-listner for redirecting to getweather page when we hit click on "getweather" button in the home page
document.addEventListener(function() {
    var anchor = document.querySelector('.btn-box a');

    anchor.addEventListener('click', function(event) {
        window.location.href = "getweather.html";
    });
});


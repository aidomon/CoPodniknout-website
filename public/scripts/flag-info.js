$(document).ready(function () {
    $("#flag1").click(function () {
        $("#flag-czech").slideToggle("fast");
        $("#flag-italy").hide();
        $("#flag-spain").hide();
        $("#flag-croatia").hide();
    });
    $("#flag2").click(function () {
        $("#flag-italy").slideToggle("fast");
        $("#flag-czech").hide();
        $("#flag-spain").hide();
        $("#flag-croatia").hide();
    });
    $("#flag3").click(function () {
        $("#flag-spain").slideToggle("fast");
        $("#flag-czech").hide();
        $("#flag-italy").hide();
        $("#flag-croatia").hide();
    });
    $("#flag4").click(function () {
        $("#flag-croatia").slideToggle("fast");
        $("#flag-czech").hide();
        $("#flag-spain").hide();
        $("#flag-italy").hide();
    });
});

// function showInfoIT(){
//     var x = document.getElementById("flag-italy");
//     if (x.style.display === "none") {
//         x.style.display = "block";
//     } else {
//         x.style.display = "none";
//     }
// }
// function showInfoSP(){
//     var x = document.getElementById("flag-spain");
//     if (x.style.display === "none") {
//         x.style.display = "block";
//     } else {
//         x.style.display = "none";
//     }
// }
// function showInfoHR(){
//     var x = document.getElementById("flag-croatia");
//     if (x.style.display === "none") {
//         x.style.display = "block";
//     } else {
//         x.style.display = "none";
//     }
// }

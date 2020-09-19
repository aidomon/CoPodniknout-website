$(document).ready(function(){
    $(".card").hover(
        function(){            
            $(this).animate({
                marginTop: "-=8%",
            },200);
        },
        function(){
            $(this).animate({
                marginTop: "0%",
            },200);
        }
    );
});
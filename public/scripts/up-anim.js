$(document).ready(function(){
    $(".item-inner").hover(
        function(){            
            $(this).animate({
                marginTop: "-=20px",
            },200);
        },
        function(){
            $(this).animate({
                marginTop: "30px",
            },200);
        }
    );
});
$(function () {
    setInterval(function () {
        $('.star-1').fadeOut(1000).fadeIn(1000).fadeOut(1000).delay(1350).animate({ left: (Math.random() * $(document).width() + "px"), top: (Math.random() * $(document).height() + "px") }, 0);
    }, 1);

    $('.star-1').one('click', function () {
        $('#egg').animate({ opacity: 0 }, 1000, function () {
            $(this).css('z-index', 1000).css('display', 'flex')
        }).animate({ opacity: 1 }, 500, function () {
            $('#myAudio').get(0).play();
        });
    });

    $('#egg').one('click', function () {
        $(this).animate({ opacity: 0 }, 500, function () {
            $(this).css('z-index', -1).css('display', 'none'); $('#myAudio').get(0).pause(); $('#myAudio').get(0).currentTime = 0
        });
    });
});
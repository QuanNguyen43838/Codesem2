// chuyen dong len xuong nen background va dung khi chuyen traNG (Giam tai CPU va GPU)
function animateBoxGlass() {
    const boxGlasses = document.querySelectorAll('.box-glass');
    let startTime = null;
    let frameId;
    function animate(time) {
        if (!startTime) startTime = time;
        const elapsedTime = time - startTime;

        boxGlasses.forEach((box, index) => {
            //  Sử dụng Math.sin để tạo chuyển động lên xuống vĩnh viễn
            const position = Math.sin(elapsedTime * 0.001 + index) * 30; // Biên độ chuyển động là 20px
            box.style.transform = `translateY(${position}px)`; // Chuyển động theo trục Y

        });
        frameId = requestAnimationFrame(animate);
    }
    function startAnimation() {
        frameId = requestAnimationFrame(animate);
    }
    function stopAnimation() {
        cancelAnimationFrame(frameId);
    }
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible') {
            startAnimation();
        }
        else {
            stopAnimation();
        }
    });
    startAnimation();
}
animateBoxGlass();

document.addEventListener('DOMContentLoaded', function () {
    const forgotForm = document.getElementById('forgot-form');
    const forgotBtn = document.querySelector('#forgot-form input[type="submit"]');
    const forgotInput = document.querySelector('#forgot-form input[type="text"]');

    forgotBtn.addEventListener('click', function (e) {
        e.preventDefault();
        forgotInput.forEach(input => input.classList.add('slide-in'));
        setTimeout(function () {
            forgotForm.submit();
        }, 300)
    })
});

const logBtn = document.getElementById('login');
logBtn.addEventListener('click', function () {
    window.location.href = 'log.html';
})
window.addEventListener('load', () => {
    const messages = [
        "Chúc mẹ luôn khỏe mạnh và hạnh phúc 🌸",
        "Cảm ơn mẹ vì những hi sinh thầm lặng và tình yêu bao la không điều kiện 💖",
        "Chúc mẹ luôn giữ nụ cười hiền và ánh mắt dịu dàng, như ngọn đèn sưởi ấm gia đình 💕",
        "Con yêu mẹ rất nhiều — mong mỗi ngày của mẹ đều tràn ngập niềm vui và bình an 🌷",
        "Mong sao mẹ luôn bình an, hạnh phúc và khoẻ mạnh 🌼",
        "20/10 là ngày đặc biệt, nhưng với con, mỗi ngày đều là ngày của mẹ 💫"
    ];

    const msgEl = document.getElementById('message');
    let i = 0;
    msgEl.style.opacity = 1;
    setInterval(() => {
        msgEl.style.opacity = 0;
        setTimeout(() => {
            i = (i + 1) % messages.length;
            msgEl.textContent = messages[i];
            msgEl.style.opacity = 1;
        }, 800);
    }, 4800);

    const falling = [];
    for (let k = 1; k <= 12; k++) falling.push(`style/img/Anh (${k}).png`);

    const activePositions = [];
    function createFallingImage() {
        let left;
        const safe = 8;
        const minDistance = 10;
        let tries = 0;
        do {
            left = safe + Math.random() * (100 - 2 * safe);
            tries++;
        } while (activePositions.some(x => Math.abs(x - left) < minDistance) && tries < 20);

        const el = document.createElement('img');
        el.className = 'falling-img';
        el.src = falling[Math.floor(Math.random() * falling.length)];
        el.style.left = left + 'vw';

        let min = 80, max = 120;
        if (window.innerWidth <= 480) { min = 40; max = 70; }
        else if (window.innerWidth <= 768) { min = 60; max = 90; }
        el.style.width = (min + Math.random() * (max - min)) + 'px';
        el.style.animationDuration = (8 + Math.random() * 4) + 's';
        el.style.transform = `rotate(${Math.random() * 360}deg)`;

        document.body.appendChild(el);
        activePositions.push(left);

        setTimeout(() => {
            el.remove();
            const idx = activePositions.indexOf(left);
            if (idx !== -1) activePositions.splice(idx, 1);
        }, 14000);
    }

    setInterval(createFallingImage, 1100);

    const bgm = document.getElementById('bgm');
    const toggle = document.getElementById('soundToggle');
    let playing = false;

    toggle.addEventListener('click', async () => {
        try {
            if (!playing) {
                bgm.currentTime = 68;
                await bgm.play();
                toggle.textContent = "🔈";
                playing = true;
            } else {
                bgm.pause();
                toggle.textContent = "🔇";
                playing = false;
            }
        } catch (err) {
            console.log("Không thể phát", err);
        }
    });
});

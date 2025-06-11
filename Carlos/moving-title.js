function moveTitle() {
    const title = document.getElementById('mexe');
    if (!title) return;
    const margin = 20;
    const maxX = window.innerWidth - title.offsetWidth - margin;
    const maxY = window.innerHeight - title.offsetHeight - margin;
    const randomX = Math.random() * (maxX - margin) + margin;
    const randomY = Math.random() * (maxY - margin) + margin - 100;
    title.style.left = `${randomX}px`;
    title.style.top = `${randomY}px`;
}

window.onload = function() {
    setInterval(moveTitle, 1000);
};

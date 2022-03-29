

function updateBar(value, currentBest) {
    let bar = document.querySelectorAll('.bar');
    bar.forEach((progress) => {
        progress.style.width = `${value}%`
        progress.setAttribute('data-text', `${value}%`)
    });
    let barbest = document.querySelectorAll('.bar-best');
    barbest.forEach((bestBar) => {
        bestBar.style.left = `${currentBest}%`
        bestBar.setAttribute('data-text', `${currentBest}%`)
    });
}
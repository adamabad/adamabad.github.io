window.onload = function () {
    let bar = document.querySelectorAll('.bar');
    bar.forEach((progress) => {
      let value = progress.getAttribute('data-value');
      progress.style.width = `${value}%`;
      let count = 0;
      let progressAnimation = setInterval(() => {
        count++;
        progress.setAttribute('data-text', `${count}%`);
        if (count >= value) {
          clearInterval(progressAnimation);
        }
      }, 15);
    });
  };

function updateBar(value, currentBest) {
    console.log(value);
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
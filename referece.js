// https://videoinu.com/blog/pip-for-web-apps/

function orderFood() {
  const canvas = document.getElementById('food-delivery');
  const ctx = canvas.getContext('2d');
  let start = +new Date();
  requestAnimationFrame(function tick() {
    const elapsed = (+new Date() - start) / 1000;
    requestAnimationFrame(tick);

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'center';
    ctx.font = '72px serif';
    const mins = Math.max(0, Math.floor(((60 - elapsed) * 24) / 60));
    ctx.fillText(`${mins} min`, 150, 75);
    ctx.font = '24px serif';

    const status =
      mins > 20
        ? 'preparing'
        : mins > 15
        ? 'waiting for driver'
        : mins > 2
        ? 'delivering'
        : 'about to be there!';
    ctx.fillText(status, 150, 115);
  });

  document.getElementById('order-button').disabled = true;
  document.getElementById('pip-button').disabled = false;
}

function pip() {
  const canvas = document.getElementById('food-delivery');

  const video = document.createElement('video');
  video.muted = true;
  video.srcObject = canvas.captureStream();
  video.addEventListener('loadedmetadata', () => {
    video.requestPictureInPicture();
  });
  video.play();

  document.getElementById('pip-button').disabled = true;
}

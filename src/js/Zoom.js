// not working

const zoom = () => {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d');
    let translatePos = {
      x: canvas.width / 2,
      y: canvas.height / 2
    };

    let scale = 1.0;
    let scaleMultiplier = 0.8;

    // add button event listeners
    document.getElementById("plus").addEventListener("click", function () {
      context.translate(translatePos.x, translatePos.y);
      context.scale(scale, scale);
    }, false);

    document.getElementById("minus").addEventListener("click", function () {
      scale *= scaleMultiplier;
      context.translate(translatePos.x, translatePos.y);
      context.scale(scale, scale);
    }, false);

  };

  export default zoom
const container = document.getElementById("container-stripes");

let colors = [
  "#FF0000",
  "#8B0000",
  "#FFA500",
  "#FF4500",
  "#FFFF00",
  "#FFD700",
  "#7CFC00",
  "#006400",
  "#00BFFF",
  "#0000CD",
  "#4B0082",
  "#2E0854",
  "#DA70D6",
  "#800080",
];

// Cria as faixas inicialmente
colors.forEach((color) => {
  const stripe = document.createElement("div");
  stripe.classList.add("stripe");
  stripe.style.backgroundColor = color;
  container.appendChild(stripe);
});

function updateStripesColors() {
  const stripes = container.querySelectorAll(".stripe");
  stripes.forEach((stripe, index) => {
    stripe.style.backgroundColor = colors[index];
  });
}

let lastY = null;
let throttleTimeout = null;

container.addEventListener("mousemove", (e) => {
  if (lastY === null) {
    lastY = e.clientY;
    return;
  }

  if (throttleTimeout) return; // limita a frequência para evitar execuções excessivas

  throttleTimeout = setTimeout(() => {
    const deltaY = e.clientY - lastY;

    if (Math.abs(deltaY) > 5) {
      // só considera movimentos maiores que 5px
      if (deltaY > 0) {
        // Mouse movendo pra baixo -> cores sobem
        colors.unshift(colors.pop());
      } else {
        // Mouse movendo pra cima -> cores descem
        colors.push(colors.shift());
      }
      updateStripesColors();
      lastY = e.clientY;
    }

    throttleTimeout = null;
  }, 50); // executa a cada 50ms
});

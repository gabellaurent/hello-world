const container = document.getElementById("container-stripes");

let colors = [
[
  "#FF0000", 
  "#FF6347", 
  "#FF4500", 
  "#DC143C", 
  "#B22222", 
  "#8B0000", 
  "#A52A2A", 
  "#CD5C5C", 
  "#E9967A", 
  "#FA8072", 
  "#F08080", 
  "#FF7F7F", 
  "#FF2400",
  "#C41E3A" 
], 
  
  [
  "#E0FFFF",
  "#B0E0E6",
  "#ADD8E6",
  "#87CEEB",
  "#87CEFA",
  "#00BFFF",
  "#1E90FF",
  "#4682B4",
  "#5F9EA0",
  "#4169E1",
  "#0000FF",
  "#0000CD",
  "#00008B",
  "#191970",
  ],

  [ // Grupo 2 – verdes
    "#006400", "#228B22", "#32CD32", "#00FF00",
    "#7CFC00", "#7FFF00", "#ADFF2F", "#98FB98",
    "#90EE90", "#8FBC8F", "#2E8B57", "#3CB371",
    "#00FA9A", "#66CDAA"
  ]

];

let currentGroupIndex = 0;

// Cria as faixas inicialmente

colors[0].forEach(color => {
  const stripe = document.createElement("div");
  stripe.classList.add("stripe");
  stripe.style.backgroundColor = color;
  container.appendChild(stripe);
});

function updateStripesColors() {
  const stripes = container.querySelectorAll(".stripe");
  const activeGroup = colors[currentGroupIndex];

  stripes.forEach((stripe, index) => {
    stripe.style.backgroundColor = activeGroup[index];

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

    if (Math.abs(deltaY) > 1) {
      // só considera movimentos maiores que 1px
      if (deltaY > 0) {
        // Mouse movendo pra baixo -> cores sobem
        colors[currentGroupIndex].unshift(colors[currentGroupIndex].pop());
      } else {
        // Mouse movendo pra cima -> cores descem
        colors[currentGroupIndex].push(colors[currentGroupIndex].shift());
      }
      updateStripesColors();
      lastY = e.clientY;
    }

    throttleTimeout = null;
  }, 50); // executa a cada 50ms
});

document.addEventListener("mousedown", function (e) {
  if (e.button === 0) {
    currentGroupIndex = (currentGroupIndex + 1) % colors.length;
      updateStripesColors();

  }
});


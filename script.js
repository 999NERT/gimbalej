let pool = ["Karambit", "AK-47", "AWP", "Deagle", "M4A1-S"];
const itemsDiv = document.getElementById("items");
const resultP = document.getElementById("result");
const openBtn = document.getElementById("openBtn");

let isAnimating = false;

function updateNickPool() {
  const input = document.getElementById("nickInput").value;
  const lines = input
    .split("\n")
    .map((n) => n.trim())
    .filter((n) => n !== "");
  if (lines.length > 0) pool = lines;
  alert("Zaktualizowano listę nicków!");
}

function createItemsRow() {
  const row = [];
  for (let i = 0; i < 30; i++) {
    const name = pool[Math.floor(Math.random() * pool.length)];
    const itemDiv = document.createElement("div");
    itemDiv.className = "item";
    itemDiv.innerText = name;
    row.push(itemDiv);
  }
  return row;
}

function openCase() {
  if (isAnimating) return;
  isAnimating = true;
  openBtn.disabled = true;
  resultP.textContent = "";

  itemsDiv.innerHTML = "";
  const itemsRow = createItemsRow();
  itemsRow.forEach((item) => itemsDiv.appendChild(item));

  // Reset transformacji
  itemsDiv.style.transition = "none";
  itemsDiv.style.transform = `translateX(0)`;

  // Zapewniamy, że reset zostanie wyrenderowany zanim zacznie się animacja
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      // Losujemy index zwycięzcy
      let offset = Math.floor(Math.random() * itemsRow.length);

      // Obliczamy maksymalne przesunięcie (szerokość elementów minus szerokość widocznego okna)
      const totalWidth = itemsRow.length * 110; // 100px szerokości + 2*5px marginesu
      const visibleWidth = 600; // szerokość kontenera

      const maxShift = -(totalWidth - visibleWidth);
      let shift = -(offset * 110 - visibleWidth / 2 + 55); // 55 = połowa szerokości elementu

      // Ograniczamy przesunięcie, żeby nie przesunąć za bardzo w lewo lub prawo
      if (shift < maxShift) shift = maxShift;
      if (shift > 0) shift = 0;

      // Start animacji
      itemsDiv.style.transition = "transform 3s ease-out";
      itemsDiv.style.transform = `translateX(${shift}px)`;

      setTimeout(() => {
        const wonItem = itemsRow[offset];
        if (wonItem) {
          resultP.textContent = `🎉 Wylosowano: ${wonItem.innerText}`;
        } else {
          resultP.textContent = "😞 Nic nie wylosowano!";
        }
        isAnimating = false;
        openBtn.disabled = false;
      }, 3100);
    });
  });
}

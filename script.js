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
    .filter((n) => n.length > 0);
  if (lines.length > 0) {
    pool = lines;
    alert("Zaktualizowano listę nicków!");
  } else {
    alert("Lista nicków nie może być pusta!");
  }
}

function createItemsRow() {
  const row = [];
  if (pool.length === 0) {
    // Gdy pool pusty, wstaw elementy z tekstem 'Brak nicków'
    for (let i = 0; i < 30; i++) {
      const itemDiv = document.createElement("div");
      itemDiv.className = "item";
      itemDiv.innerText = "Brak nicków";
      row.push(itemDiv);
    }
  } else {
    for (let i = 0; i < 30; i++) {
      const name = pool[Math.floor(Math.random() * pool.length)];
      const itemDiv = document.createElement("div");
      itemDiv.className = "item";
      itemDiv.innerText = name;
      row.push(itemDiv);
    }
  }
  return row;
}

function openCase() {
  if (isAnimating) return;

  isAnimating = true;
  openBtn.disabled = true;
  resultP.textContent = "";

  // Usuń wszystkie elementy i style przed animacją
  itemsDiv.style.transition = "none";
  itemsDiv.style.transform = "translateX(0)";
  itemsDiv.innerHTML = "";
  itemsDiv.style.willChange = "transform";

  const itemsRow = createItemsRow();
  itemsRow.forEach((item) => itemsDiv.appendChild(item));

  // Wymuś repaint i zacznij animację w kolejnym frame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const totalWidth = itemsRow.length * 110;
      const visibleWidth = 600;
      const maxShift = -(totalWidth - visibleWidth);

      let offset = Math.floor(Math.random() * itemsRow.length);
      let shift = -(offset * 110 - visibleWidth / 2 + 55);

      // Ogranicz przesunięcie w granicach
      if (shift < maxShift) shift = maxShift;
      if (shift > 0) shift = 0;

      itemsDiv.style.transition = "transform 3s ease-out";
      itemsDiv.style.transform = `translateX(${shift}px)`;

      setTimeout(() => {
        const wonItem = itemsRow[offset];
        if (wonItem && wonItem.innerText.trim().length > 0) {
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

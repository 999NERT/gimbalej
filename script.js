let pool = ["Karambit", "AK-47", "AWP", "Deagle", "M4A1-S"];
const itemsDiv = document.getElementById("items");
const resultP = document.getElementById("result");
const openBtn = document.getElementById("openBtn");

let isAnimating = false;

function updateNickPool() {
  const input = document.getElementById("nickInput").value;
  const lines = input.split("\n").map((n) => n.trim()).filter((n) => n !== "");
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

  itemsDiv.style.transition = "none";
  itemsDiv.style.transform = `translateX(0)`;

  void itemsDiv.offsetWidth; // force repaint

  const offset = Math.floor(Math.random() * itemsRow.length);
  const shift = -(offset * 110 - 250);

  itemsDiv.style.transition = "transform 3s ease-out";
  itemsDiv.style.transform = `translateX(${shift}px)`;

  setTimeout(() => {
    const wonItem = itemsRow[offset];
    resultP.textContent = `🎉 Wylosowano: ${wonItem.innerText}`;
    isAnimating = false;
    openBtn.disabled = false;
  }, 3100);
}

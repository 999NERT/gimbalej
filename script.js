const itemsDiv = document.getElementById("items");
const openBtn = document.getElementById("openBtn");
const saveBtn = document.getElementById("saveBtn");
const nickInput = document.getElementById("nickInput");
const resultP = document.getElementById("result");

let nickPool = [];
let isAnimating = false;

function updateNickPool() {
  const raw = nickInput.value.trim();
  if (!raw) {
    alert("Wpisz przynajmniej jeden nick.");
    return;
  }
  nickPool = raw.split("\n").map(n => n.trim()).filter(n => n.length > 0);

  if (nickPool.length === 0) {
    alert("Wpisz przynajmniej jeden poprawny nick.");
    return;
  }

  resultP.textContent = `Załadowano ${nickPool.length} nicków. Możesz otworzyć skrzynkę!`;
}

function createItemsRow() {
  const multiplier = 10;
  const items = [];

  for (let i = 0; i < nickPool.length * multiplier; i++) {
    const div = document.createElement("div");
    div.className = "item";
    div.textContent = nickPool[i % nickPool.length];
    items.push(div);
  }

  return items;
}

function openCase() {
  if (isAnimating) return;
  if (nickPool.length === 0) {
    alert("Najpierw wczytaj nicki klikając 'Zapisz nicki'");
    return;
  }

  isAnimating = true;
  openBtn.disabled = true;
  saveBtn.disabled = true;
  resultP.textContent = "";
  
  itemsDiv.style.transition = "none";
  itemsDiv.style.transform = "translateX(0)";
  itemsDiv.innerHTML = "";

  const items = createItemsRow();
  items.forEach(el => itemsDiv.appendChild(el));

  const visibleWidth = 600;
  const itemWidth = 120;
  const totalItems = items.length;

  const winnerIndex = Math.floor(Math.random() * (totalItems - 10)) + 5;
  const shift = -(winnerIndex * itemWidth - visibleWidth / 2 + itemWidth / 2);

  setTimeout(() => {
    itemsDiv.style.transition = "none";
    itemsDiv.style.transform = "translateX(0)";
    void itemsDiv.offsetWidth; // reflow

    itemsDiv.style.transition = "transform 3s ease-out";
    itemsDiv.style.transform = `translateX(${shift}px)`;
  }, 100);

  setTimeout(() => {
    const winner = items[winnerIndex].textContent;
    resultP.textContent = `🎉 Wygrał: ${winner}`;
    isAnimating = false;
    openBtn.disabled = false;
    saveBtn.disabled = false;
  }, 3300);
}

saveBtn.addEventListener("click", updateNickPool);
openBtn.addEventListener("click", openCase);

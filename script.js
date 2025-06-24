const itemsDiv = document.getElementById("items");
const openBtn = document.getElementById("openBtn");
const input = document.getElementById("nicknameInput");
const resultP = document.getElementById("result");

let isAnimating = false;

function getRandomName() {
  const names = ["Karambit", "AWP", "AK-47", "M4A1", "Glock", "USP-S", "P250"];
  return names[Math.floor(Math.random() * names.length)];
}

function createItemsRow(nickname) {
  const items = [];
  const totalItems = 20;
  const winnerIndex = Math.floor(Math.random() * totalItems);

  for (let i = 0; i < totalItems; i++) {
    const div = document.createElement("div");
    div.className = "item";
    div.textContent = i === winnerIndex ? nickname : getRandomName();
    items.push(div);
  }

  return { items, winnerIndex };
}

function openCase() {
  if (isAnimating) return;

  isAnimating = true;
  resultP.textContent = "";

  const nickname = input.value.trim() || "Anonim";

  openBtn.disabled = true;
  openBtn.classList.add("hidden");
  itemsDiv.innerHTML = "";
  itemsDiv.style.transition = "none";
  itemsDiv.style.transform = "translateX(0)";

  const { items, winnerIndex } = createItemsRow(nickname);
  items.forEach((el) => itemsDiv.appendChild(el));

  setTimeout(() => {
    const totalWidth = items.length * 120;
    const visibleWidth = 600;
    let shift = -(winnerIndex * 120 - visibleWidth / 2 + 60);
    const maxShift = -(totalWidth - visibleWidth);

    if (shift < maxShift) shift = maxShift;
    if (shift > 0) shift = 0;

    itemsDiv.style.transition = "transform 3s ease-out";
    itemsDiv.style.transform = `translateX(${shift}px)`;

    setTimeout(() => {
      const won = items[winnerIndex]?.textContent || "nic";
      resultP.textContent = `🎉 Wylosowano: ${won}`;
      openBtn.disabled = false;
      openBtn.classList.remove("hidden");
      isAnimating = false;
    }, 3100);
  }, 1000); // 1s delay before animation starts
}

openBtn.addEventListener("click", openCase);

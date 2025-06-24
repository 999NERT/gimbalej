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
  openBtn.classList.add("hidden");
  resultP.textContent = "";

  const nickname = input.value.trim() || "Anonim";

  itemsDiv.innerHTML = "";
  itemsDiv.style.transition = "none";
  itemsDiv.style.transform = "translateX(0)";

  const { items, winnerIndex } = createItemsRow(nickname);
  items.forEach((el) => itemsDiv.appendChild(el));

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
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
        isAnimating = false;
        openBtn.classList.remove("hidden");
      }, 3100);
    });
  });
}

openBtn.addEventListener("click", () => {
  setTimeout(openCase, 1000); // opóźnienie 1 sekunda
});

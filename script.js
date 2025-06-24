const itemsTrack = document.getElementById("items");
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
  const totalItems = 30;
  const winnerIndex = Math.floor(Math.random() * (totalItems - 10)) + 5;

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

  itemsTrack.innerHTML = "";
  itemsTrack.style.transition = "none";
  itemsTrack.style.transform = "translateX(0)";

  const { items, winnerIndex } = createItemsRow(nickname);
  items.forEach((el) => itemsTrack.appendChild(el));

  // Poczekaj sekundę, zanim uruchomisz animację
  setTimeout(() => {
    const shift = -(winnerIndex * 120 - 600 / 2 + 60);

    itemsTrack.style.transition = "transform 3s ease-out";
    itemsTrack.style.transform = `translateX(${shift}px)`;

    setTimeout(() => {
      const won = items[winnerIndex]?.textContent || "nic";
      resultP.textContent = `🎉 Wylosowano: ${won}`;
      openBtn.disabled = false;
      openBtn.classList.remove("hidden");
      isAnimating = false;
    }, 3100);
  }, 1000);
}

openBtn.addEventListener("click", openCase);

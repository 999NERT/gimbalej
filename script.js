const itemsDiv = document.getElementById("items");
const openBtn = document.getElementById("openBtn");
const saveBtn = document.getElementById("saveBtn");
const nickInput = document.getElementById("nickInput");
const resultP = document.getElementById("result");

let nickPool = [];
let isAnimating = false;
let animationFrameId = null;
let animationStartTime = null;
const animationDuration = 4000; // animacja trwa 4 sekundy
let startPosition = 0;
let targetPosition = 0;

const ITEM_WIDTH = 130 + 20; // szerokość itema + margines (width + 2 * 10px margin)

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
  // Tworzymy powtarzającą się listę nicków, żeby animacja była płynna i nieskończona
  const repeatedCount = Math.max(10, nickPool.length * 5);
  const items = [];

  for (let i = 0; i < repeatedCount; i++) {
    const div = document.createElement("div");
    div.className = "item";
    div.textContent = nickPool[i % nickPool.length];
    items.push(div);
  }

  return items;
}

function animate(timestamp) {
  if (!animationStartTime) animationStartTime = timestamp;
  const elapsed = timestamp - animationStartTime;

  // Przesuwamy itemsDiv liniowo w lewo
  const progress = Math.min(elapsed / animationDuration, 1);
  const currentX = startPosition + (targetPosition - startPosition) * progress;

  itemsDiv.style.transform = `translateX(${currentX}px)`;

  if (progress < 1) {
    animationFrameId = requestAnimationFrame(animate);
  } else {
    finishAnimation();
  }
}

function finishAnimation() {
  isAnimating = false;
  openBtn.style.display = "inline-block";  // przywróć przycisk
  saveBtn.disabled = false;
  openBtn.disabled = false;

  // Obliczamy index wygranego na podstawie docelowego przesunięcia
  const winnerIndex = Math.round((-targetPosition + 600 / 2 - ITEM_WIDTH / 2) / ITEM_WIDTH);
  const items = itemsDiv.children;
  let winnerNick = "Brak";
  if (items[winnerIndex]) winnerNick = items[winnerIndex].textContent;

  resultP.textContent = `🎉 Wygrał: ${winnerNick}`;
}

function openCase() {
  if (isAnimating) return;
  if (nickPool.length === 0) {
    alert("Najpierw wczytaj nicki klikając 'Zapisz nicki'");
    return;
  }

  isAnimating = true;
  openBtn.style.display = "none";  // schowaj przycisk podczas animacji
  saveBtn.disabled = true;
  openBtn.disabled = true;
  resultP.textContent = "";

  // Wyczyść i ustaw początkową pozycję
  itemsDiv.innerHTML = "";
  itemsDiv.style.transition = "none";
  itemsDiv.style.transform = "translateX(0)";
  animationStartTime = null;

  const items = createItemsRow();
  items.forEach(el => itemsDiv.appendChild(el));

  // Losujemy zwycięzcę (index w powtarzającej się liście)
  const totalItems = items.length;
  const winnerIndex = Math.floor(Math.random() * totalItems);

  // startPosition to 0 (pozycja początkowa)
  startPosition = 0;

  // targetPosition przesuwamy tak, aby zwycięzca był na środku
  const containerCenter = 600 / 2;
  targetPosition = -(winnerIndex * ITEM_WIDTH - containerCenter + ITEM_WIDTH / 2);

  // Anuluj poprzednią animację, jeśli istnieje
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  // Start animacji
  animationFrameId = requestAnimationFrame(animate);
}

// Eventy
saveBtn.addEventListener("click", updateNickPool);
openBtn.addEventListener("click", openCase);

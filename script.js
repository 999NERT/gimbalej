const itemsDiv = document.getElementById("items");
const openBtn = document.getElementById("openBtn");
const saveBtn = document.getElementById("saveBtn");
const nickInput = document.getElementById("nickInput");
const resultP = document.getElementById("result");

let nickPool = [];
let isAnimating = false;
let animationFrameId = null;
let animationStartTime = null;

const animationDuration = 4000; // 4 sekundy
const containerWidth = 600;
const ITEM_WIDTH = 130 + 20; // szerokość itema + marginesy (margin-left + margin-right = 10 + 10)

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// Aktualizacja puli nicków z textarea
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

saveBtn.addEventListener("click", updateNickPool);

// Tworzymy długą listę elementów do animacji (nieskończona pętla)
function createItemsRow() {
  const repeatCount = Math.max(40, nickPool.length * 10);
  const items = [];

  for (let i = 0; i < repeatCount; i++) {
    const div = document.createElement("div");
    div.className = "item";
    div.textContent = nickPool[i % nickPool.length];
    items.push(div);
  }
  return items;
}

let startPosition = 0;
let targetPosition = 0;

function finishAnimation(winnerIndex) {
  isAnimating = false;
  openBtn.style.display = "inline-block";
  saveBtn.disabled = false;
  openBtn.disabled = false;

  const items = itemsDiv.children;
  let winnerNick = "Brak";

  if (items[winnerIndex]) winnerNick = items[winnerIndex].textContent;
  resultP.textContent = `🎉 Wygrał: ${winnerNick}`;
}

function animate(timestamp) {
  if (!animationStartTime) animationStartTime = timestamp;
  const elapsed = timestamp - animationStartTime;

  const progress = Math.min(elapsed / animationDuration, 1);

  // Obliczamy aktualne przesunięcie z easingiem
  const currentX = startPosition + (targetPosition - startPosition) * easeOutCubic(progress);

  itemsDiv.style.transform = `translateX(${currentX}px)`;

  if (progress < 1) {
    animationFrameId = requestAnimationFrame(animate);
  } else {
    // Wyliczamy index zwycięzcy na podstawie przesunięcia i szerokości itemów
    const winnerIndex = Math.round((-targetPosition + containerWidth / 2 - ITEM_WIDTH / 2) / ITEM_WIDTH);
    finishAnimation(winnerIndex);
  }
}

function openCase() {
  if (isAnimating) return;
  if (nickPool.length === 0) {
    alert("Najpierw wczytaj nicki klikając 'Zapisz nicki'");
    return;
  }

  // Anuluj poprzednią animację jeśli istnieje
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  isAnimating = true;
  openBtn.style.display = "none";
  saveBtn.disabled = true;
  openBtn.disabled = true;
  resultP.textContent = "";

  itemsDiv.innerHTML = "";
  itemsDiv.style.transition = "none";
  itemsDiv.style.transform = `translateX(0)`;
  animationStartTime = null;

  const items = createItemsRow();
  items.forEach(el => itemsDiv.appendChild(el));

  const totalItems = items.length;
  // Losujemy zwycięzcę od 10 do totalItems-10, by zwycięzca był po środku animacji
  const winnerIndex = Math.floor(Math.random() * (totalItems - 20)) + 10;

  startPosition = 0;
  targetPosition = -(winnerIndex * ITEM_WIDTH) + (containerWidth / 2 - ITEM_WIDTH / 2);

  animationFrameId = requestAnimationFrame(animate);
}

// Obsługa kliknięcia
openBtn.addEventListener("click", openCase);

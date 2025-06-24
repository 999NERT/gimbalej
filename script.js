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
const ITEM_WIDTH = 130 + 20; // 130px szerokości + 2*10px margines

// Zaktualizuj listę nicków z textarea
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

// Tworzymy dużą listę kwadratów, powtarzając nicki aby animacja była nieskończona
function createItemsRow() {
  // Zawsze minimum 40 elementów, by animacja nie miała pustych miejsc
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

// Animacja przesuwania liniowo z requestAnimationFrame
function animate(timestamp) {
  if (!animationStartTime) animationStartTime = timestamp;
  const elapsed = timestamp - animationStartTime;

  const progress = Math.min(elapsed / animationDuration, 1);

  // Przesunięcie od 0 do targetPosition
  const currentX = startPosition + (targetPosition - startPosition) * easeOutCubic(progress);

  itemsDiv.style.transform = `translateX(${currentX}px)`;

  if (progress < 1) {
    animationFrameId = requestAnimationFrame(animate);
  } else {
    finishAnimation();
  }
}

// Łagodzenie animacji (ease out cubic)
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// Kończy animację, ustawia zwycięzcę i odblokowuje przycisk
function finishAnimation() {
  isAnimating = false;
  openBtn.style.display = "inline-block";
  saveBtn.disabled = false;
  openBtn.disabled = false;

  // Wylicz zwycięzcę na podstawie przesunięcia
  const winnerIndex = Math.round((-targetPosition + containerWidth / 2 - ITEM_WIDTH / 2) / ITEM_WIDTH);
  const items = itemsDiv.children;
  let winnerNick = "Brak";
  if (items[winnerIndex]) winnerNick = items[winnerIndex].textContent;

  resultP.textContent = `🎉 Wygrał: ${winnerNick}`;
}

let startPosition = 0;
let targetPosition = 0;

// Funkcja startująca animację
function openCase() {
  if (isAnimating) return;
  if (nickPool.length === 0) {
    alert("Najpierw wczytaj nicki klikając 'Zapisz nicki'");
    return;
  }

  isAnimating = true;
  openBtn.style.display = "none";
  saveBtn.disabled = true;
  openBtn.disabled = true;
  resultP.textContent = "";

  // Reset i ustawienie początkowej pozycji
  itemsDiv.innerHTML = "";
  itemsDiv.style.transition = "none";
  itemsDiv.style.transform = `translateX(0)`;
  animationStartTime = null;

  const items = createItemsRow();
  items.forEach(el => itemsDiv.appendChild(el));

  const totalItems = items.length;
  // Losujemy zwycięzcę na pozycji od 10 do totalItems-10, żeby był bezpiecznie w środku listy
  const winnerIndex = Math.floor(Math.random() * (totalItems - 20)) + 10;

  startPosition = 0;

  // Wyliczamy docelowe przesunięcie tak, żeby zwycięzca znalazł się na środku

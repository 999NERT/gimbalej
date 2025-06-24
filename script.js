const itemsDiv = document.getElementById("items");
const openBtn = document.getElementById("openBtn");
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
  // Pobierz nicki z textarea, jeden na linię, bez pustych
  nickPool = raw.split("\n").map(n => n.trim()).filter(n => n.length > 0);

  if (nickPool.length === 0) {
    alert("Wpisz przynajmniej jeden poprawny nick.");
    return;
  }

  resultP.textContent = `Załadowano ${nickPool.length} nicków. Możesz otworzyć skrzynkę!`;
}

function createItemsRow() {
  // Stwórz wystarczająco dużo elementów na całą animację
  // Powiel nicki kilkukrotnie, żeby efekt był płynny
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
  resultP.textContent = "";
  itemsDiv.style.transition = "none";
  itemsDiv.style.transform = "translateX(0)";
  itemsDiv.innerHTML = "";

  const items = createItemsRow();
  items.forEach(el => itemsDiv.appendChild(el));

  // Wybierz losowy index zwycięzcy w środku "ekranu"
  const visibleWidth = 600; // szerokość kontenera
  const itemWidth = 120; // item + margin
  const totalItems = items.length;

  // Random index w środkowym zakresie aby zwycięzca był w środku
  // losujemy index od 5 do totalItems-5, żeby animacja nie wychodziła poza elementy
  const winnerIndex = Math.floor(Math.random() * (totalItems - 10)) + 5;

  // Obliczamy przesunięcie tak, aby wybrany element był na środku
  const shift = -(winnerIndex * itemWidth - visibleWidth / 2 + itemWidth / 2);

  // Małe opóźnienie przed animacją (np 1s)
  setTimeout(() => {
    itemsDiv.style.transition = "transform 3s ease-out";
    itemsDiv.style.transform = `translateX(${shift}px)`;
  }, 1000);

  // Po animacji pokazujemy wynik
  setTimeout(() => {
    const winner = items[winnerIndex].textContent;
    resultP.textContent = `🎉 Wygrał: ${winner}`;
    isAnimating = false;
    openBtn.disabled = false;
  }, 4200);
}

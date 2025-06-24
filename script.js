const pool = [
  "Karambit ★",
  "AK-47 Redline",
  "AWP Asiimov",
  "USP-S Kill Confirmed",
  "Desert Eagle Blaze",
  "Glock-18 Fade",
  "MP9 Starlight",
  "MAC-10 Neon Rider",
  "P250 See Ya",
  "M4A1-S Hyper Beast"
];

const itemsDiv = document.getElementById("items");
const resultP = document.getElementById("result");

function createItemsRow() {
  const row = [];
  for (let i = 0; i < 30; i++) {
    const itemName = pool[Math.floor(Math.random() * pool.length)];
    const itemDiv = document.createElement("div");
    itemDiv.className = "item";
    itemDiv.innerText = itemName;
    row.push(itemDiv);
  }
  return row;
}

function openCase() {
  itemsDiv.innerHTML = "";
  const itemsRow = createItemsRow();
  itemsRow.forEach(item => itemsDiv.appendChild(item));

  const offset = Math.floor(Math.random() * (itemsRow.length - 6)) + 3; // losowy wybór
  const shift = -(offset * 110 - 250); // 100px item + 10px marginesów

  itemsDiv.style.transition = "transform 3s ease-out";
  itemsDiv.style.transform = `translateX(${shift}px)`;

  setTimeout(() => {
    const wonItem = itemsRow[offset];
    resultP.textContent = `🎉 Wygrałeś: ${wonItem.innerText}`;
  }, 3100);
}

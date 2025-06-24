function openCase() {
  if (isAnimating) return; // blokada przy wielokrotnym klikaniu
  isAnimating = true;
  openBtn.disabled = true;
  resultP.textContent = "";

  itemsDiv.innerHTML = "";
  const itemsRow = createItemsRow();
  itemsRow.forEach((item) => itemsDiv.appendChild(item));

  // Reset pozycji, bez animacji
  itemsDiv.style.transition = "none";
  itemsDiv.style.transform = `translateX(0)`;

  // Wymuszamy repaint, żeby reset zadziałał
  void itemsDiv.offsetWidth;

  // Losujemy index zwycięzcy spośród całej puli
  const offset = Math.floor(Math.random() * itemsRow.length);

  // Obliczamy przesunięcie tak, aby wybrany element był wycentrowany pod wskaźnikiem
  const shift = -(offset * 110 - 250);

  // Start animacji przesunięcia
  itemsDiv.style.transition = "transform 3s ease-out";
  itemsDiv.style.transform = `translateX(${shift}px)`;

  setTimeout(() => {
    const wonItem = itemsRow[offset];
    resultP.textContent = `🎉 Wylosowano: ${wonItem.innerText}`;
    isAnimating = false;
    openBtn.disabled = false;
  }, 3100);
}

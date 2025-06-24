function openCase() {
  if (isAnimating) return; 
  isAnimating = true;
  openBtn.disabled = true;
  resultP.textContent = "";

  itemsDiv.innerHTML = "";
  const itemsRow = createItemsRow();
  itemsRow.forEach((item) => itemsDiv.appendChild(item));

  // reset pozycji, bez animacji
  itemsDiv.style.transition = "none";
  itemsDiv.style.transform = `translateX(0)`;

  void itemsDiv.offsetWidth; // repaint

  // Losujemy index zwycięzcy losowo z całej puli (0 do itemsRow.length-1)
  const offset = Math.floor(Math.random() * itemsRow.length);

  // Obliczamy przesunięcie tak, by wybrany element był na środku (np. 250px od lewej)
  const shift = -(offset * 110 - 250);

  itemsDiv.style.transition = "transform 3s ease-out";
  itemsDiv.style.transform = `translateX(${shift}px)`;

  setTimeout(() => {
    const wonItem = itemsRow[offset];
    resultP.textContent = `🎉 Wylosowano: ${wonItem.innerText}`;
    isAnimating = false;
    openBtn.disabled = false;
  }, 3100);
}

// Elementy DOM
const uploadArea = document.getElementById('uploadArea');
const imageInput = document.getElementById('imageInput');
const translateBtn = document.getElementById('translateBtn');
const originalImage = document.getElementById('originalImage');
const translationResult = document.getElementById('translationResult');
const translatedImage = document.getElementById('translatedImage');
const copyTextBtn = document.getElementById('copyTextBtn');
const editTextBtn = document.getElementById('editTextBtn');
const downloadBtn = document.getElementById('downloadBtn');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');

// Zmienne globalne
let currentImage = null;
let extractedText = '';
let translatedText = '';

// Nasłuchiwanie zdarzeń
uploadArea.addEventListener('click', () => {
    imageInput.click();
});

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    if (e.dataTransfer.files.length) {
        handleImageUpload(e.dataTransfer.files[0]);
    }
});

imageInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
        handleImageUpload(e.target.files[0]);
    }
});

translateBtn.addEventListener('click', translateImage);
copyTextBtn.addEventListener('click', copyTranslatedText);
editTextBtn.addEventListener('click', editTranslatedText);
downloadBtn.addEventListener('click', downloadTranslatedImage);

// Aktualizacja paska postępu
function updateProgress(percent, text) {
    progressFill.style.width = `${percent}%`;
    progressText.textContent = text;
}

// Funkcja obsługująca przesyłanie obrazu
function handleImageUpload(file) {
    // Sprawdzenie czy to obraz
    if (!file.type.match('image.*')) {
        alert('Proszę wybrać plik obrazu (JPG, PNG, GIF)');
        return;
    }
    
    // Wyświetlenie podglądu obrazu
    const reader = new FileReader();
    reader.onload = (e) => {
        originalImage.innerHTML = `<img src="${e.target.result}" alt="Przesłany obraz">`;
        translateBtn.disabled = false;
        currentImage = e.target.result;
        updateProgress(0, 'Gotowy do tłumaczenia');
    };
    reader.readAsDataURL(file);
}

// Główna funkcja tłumacząca obraz
async function translateImage() {
    if (!currentImage) {
        alert('Proszę najpierw przesłać obraz');
        return;
    }
    
    // Resetowanie przycisków
    translateBtn.disabled = true;
    copyTextBtn.disabled = true;
    editTextBtn.disabled = true;
    downloadBtn.disabled = true;
    
    try {
        // 1. Ekstrakcja tekstu z obrazu przy użyciu Tesseract.js
        updateProgress(10, 'Rozpoczynanie rozpoznawania tekstu...');
        extractedText = await extractTextFromImage(currentImage);
        
        // 2. Tłumaczenie tekstu przy użyciu Google Translate API
        updateProgress(60, 'Trwa tłumaczenie tekstu...');
        translatedText = await translateTextWithGoogleAPI(extractedText);
        
        // 3. Wyświetlenie przetłumaczonego tekstu
        updateProgress(90, 'Przygotowywanie wyników...');
        displayTranslatedText(translatedText);
        
        // 4. Generowanie obrazu z przetłumaczonym tekstem
        createTranslatedImage(currentImage, translatedText);
        
        // 5. Aktywacja przycisków kontrolnych
        copyTextBtn.disabled = false;
        editTextBtn.disabled = false;
        downloadBtn.disabled = false;
        
        updateProgress(100, 'Tłumaczenie zakończone!');
        
    } catch (error) {
        console.error('Błąd podczas tłumaczenia:', error);
        translationResult.innerHTML = `<p class="error">Wystąpił błąd: ${error.message}</p>`;
        updateProgress(0, 'Wystąpił błąd podczas tłumaczenia');
    } finally {
        translateBtn.disabled = false;
    }
}

// Funkcja ekstrakcji tekstu z obrazu przy użyciu Tesseract.js
async function extractTextFromImage(imageSrc) {
    const worker = await Tesseract.createWorker('eng'); // Ustawienie języka angielskiego
    
    try {
        // Konfiguracja postępu
        worker.onProgress = (progress) => {
            const percent = Math.round(progress.progress * 100 * 0.5) + 10; // 10-60%
            updateProgress(percent, `Rozpoznawanie tekstu: ${percent}%`);
        };
        
        const { data: { text } } = await worker.recognize(imageSrc);
        await worker.terminate();
        
        if (!text || text.trim() === '') {
            throw new Error('Nie udało się rozpoznać tekstu na obrazie. Spróbuj z innym obrazem.');
        }
        
        return text.trim();
    } catch (error) {
        await worker.terminate();
        throw new Error('Błąd podczas rozpoznawania tekstu: ' + error.message);
    }
}

// Funkcja tłumaczenia tekstu przy użyciu Google Translate API
async function translateTextWithGoogleAPI(text) {
    // Sprawdzenie długości tekstu (Google Translate ma limit ~5000 znaków na żądanie)
    if (text.length > 4500) {
        // Dla długich tekstów dzielimy na części
        return await translateLongText(text);
    }
    
    // Użycie proxy CORS, aby uniknąć problemów z dostępem do API
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const apiUrl = 'https://translate.googleapis.com/translate_a/single';
    
    const params = new URLSearchParams({
        client: 'gtx',
        sl: 'en',  // source language - angielski
        tl: 'pl',  // target language - polski
        dt: 't',
        q: text
    });
    
    try {
        const response = await fetch(proxyUrl + apiUrl + '?' + params.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (!response.ok) {
            throw new Error(`Błąd API: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Google Translate zwraca tablicę tablic, gdzie każda zawiera przetłumaczone fragmenty
        if (data && Array.isArray(data[0])) {
            return data[0].map(item => item[0]).join('');
        } else {
            throw new Error('Nieprawidłowy format odpowiedzi API');
        }
    } catch (error) {
        // Jeśli proxy nie działa, spróbuj bezpośrednio (może nie zadziałać z powodu CORS)
        try {
            const response = await fetch(apiUrl + '?' + params.toString());
            
            if (!response.ok) {
                throw new Error(`Błąd API: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (data && Array.isArray(data[0])) {
                return data[0].map(item => item[0]).join('');
            } else {
                throw new Error('Nieprawidłowy format odpowiedzi API');
            }
        } catch (secondError) {
            // Jeśli obie metody zawiodą, użyj fallback - prostego tłumaczenia słowo po słowie
            console.warn('API Google Translate niedostępne, używam fallback');
            return await translateWithFallback(text);
        }
    }
}

// Funkcja do tłumac

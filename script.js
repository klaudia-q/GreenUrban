document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form');
    const inputs = form.querySelectorAll('.form-input');
    const submitButton = form.querySelector('button[type="submit"]');

    /**
     * Walidacja adresu email
     * Format: nazwa@domena.rozszerzenie
     * - nazwa: litery, cyfry, znaki specjalne (._%+-)
     * - domena: litery, cyfry, kropki, myślniki
     * - rozszerzenie: minimum 2 litery
     * Przykłady poprawnych adresów:
     * - jan.kowalski@example.com
     * - test123@test.pl
     * - imie.nazwisko@firma.com.pl
     */
    const validateEmail = (email) => {
        if (!email) {
            return { isValid: false, message: 'Email jest wymagany' };
        }
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const isValid = re.test(String(email).toLowerCase());
        return {
            isValid,
            message: isValid ? '' : 'Proszę podać poprawny adres email w formacie: nazwa@domena.pl'
        };
    };

    /**
     * Walidacja pola tekstowego (imię i nazwisko)
     * - Minimum 2 znaki (aby uniknąć pojedynczych liter)
     * - Maksimum 50 znaków (standardowa długość dla imienia i nazwiska)
     * - Dozwolone: litery, spacje, myślniki
     * - Nie mogą być same spacje
     * - Musi zaczynać się wielką literą
     */
    const validateText = (text) => {
        if (!text) {
            return { isValid: false, message: 'Imię i nazwisko jest wymagane' };
        }
        
        const trimmedText = text.trim();
        
        // Sprawdzenie długości
        if (trimmedText.length < 2 || trimmedText.length > 50) {
            return {
                isValid: false,
                message: 'Imię i nazwisko musi zawierać od 2 do 50 znaków'
            };
        }
        
        // Sprawdzenie czy zaczyna się wielką literą
        const words = trimmedText.split(/\s+/);
        const allWordsStartWithCapital = words.every(word => {
            return word.length > 0 && word[0] === word[0].toUpperCase();
        });
        
        if (!allWordsStartWithCapital) {
            return {
                isValid: false,
                message: 'Imię i nazwisko musi zaczynać się wielką literą'
            };
        }
        
        return { isValid: true, message: '' };
    };

    /**
     * Walidacja wiadomości
     * - Minimum 10 znaków (aby uniknąć zbyt krótkich wiadomości)
     * - Maksimum 1000 znaków (aby uniknąć zbyt długich wiadomości)
     * - Dozwolone: wszystkie znaki
     * - Nie mogą być same spacje
     */
    const validateMessage = (message) => {
        if (!message) {
            return { isValid: false, message: 'Wiadomość jest wymagana' };
        }
        const trimmedMessage = message.trim();
        const isValid = trimmedMessage.length >= 10 && trimmedMessage.length <= 1000;
        return {
            isValid,
            message: isValid ? '' : 'Wiadomość musi zawierać od 10 do 1000 znaków'
        };
    };

    /**
     * Wyświetlanie komunikatu błędu
     * @param {HTMLElement} input - Pole formularza
     * @param {string} message - Tekst komunikatu błędu
     */
    const showError = (input, message) => {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = 'red';
        errorDiv.style.fontSize = '0.8rem';
        errorDiv.style.marginTop = '0.25rem';

        const existingError = input.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        input.parentElement.appendChild(errorDiv);
        input.style.borderColor = 'red';
    };

    /**
     * Usuwanie komunikatu błędu
     * @param {HTMLElement} input - Pole formularza
     */
    const removeError = (input) => {
        const error = input.parentElement.querySelector('.error-message');
        if (error) {
            error.remove();
        }
        input.style.borderColor = '';
    };

    /**
     * Walidacja całego formularza
     * Sprawdza wszystkie pola i zwraca true jeśli wszystkie są poprawne
     */
    const validateForm = () => {
        let isValid = true;
        inputs.forEach(input => {
            const value = input.value;
            
            if (input.type === 'email') {
                const validation = validateEmail(value);
                if (!validation.isValid) {
                    showError(input, validation.message);
                    isValid = false;
                } else {
                    removeError(input);
                }
            } else if (input.tagName === 'TEXTAREA') {
                const validation = validateMessage(value);
                if (!validation.isValid) {
                    showError(input, validation.message);
                    isValid = false;
                } else {
                    removeError(input);
                }
            } else {
                const validation = validateText(value);
                if (!validation.isValid) {
                    showError(input, validation.message);
                    isValid = false;
                } else {
                    removeError(input);
                }
            }
        });
        return isValid;
    };

    // Obsługa wysyłania formularza
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = 'Wysyłanie...';

        try {
            // Symulacja wysyłania formularza
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Wyświetlenie komunikatu o sukcesie
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Formularz został wysłany pomyślnie!';
            successMessage.style.color = 'green';
            successMessage.style.marginTop = '1rem';
            successMessage.style.textAlign = 'center';
            
            form.reset();
            form.appendChild(successMessage);
            
            // Usunięcie komunikatu po 3 sekundach
            setTimeout(() => {
                successMessage.remove();
            }, 3000);
        } catch (error) {
            console.error('Błąd podczas wysyłania formularza:', error);
            showError(submitButton, 'Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie później.');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Wyślij';
        }
    };

    // Dodanie obsługi zdarzeń
    form.addEventListener('submit', handleSubmit);

    // Walidacja w czasie rzeczywistym
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            const value = input.value;
            
            if (input.type === 'email') {
                const validation = validateEmail(value);
                if (!validation.isValid) {
                    showError(input, validation.message);
                } else {
                    removeError(input);
                }
            } else if (input.tagName === 'TEXTAREA') {
                const validation = validateMessage(value);
                if (!validation.isValid) {
                    showError(input, validation.message);
                } else {
                    removeError(input);
                }
            } else {
                const validation = validateText(value);
                if (!validation.isValid) {
                    showError(input, validation.message);
                } else {
                    removeError(input);
                }
            }
        });
    });
}); 
// Elementos do DOM
const display = document.getElementById('display');
const historyContainer = document.createElement('div');
historyContainer.classList.add('history');
document.getElementById('calculadora').appendChild(historyContainer);

let lastResult = null; // Variável para armazenar o último resultado

// Função para limpar o display
function clearDisplay() {
    display.value = '';
    lastResult = null; // Reseta o último resultado ao limpar o display
}

// Função para adicionar valores ao display
function appendToDisplay(value) {
    const displayValue = display.value;
    const lastChar = displayValue.trim().slice(-1);

    // Mapeia * e / para x e ÷
    if (value === '*') value = 'x';
    if (value === '/') value = '÷';

    // Não permitir que o primeiro caractere seja um símbolo
    if (displayValue === '' && ['+', '-', 'x', '÷', '%'].includes(value)) {
        return;
    }

    // Não permitir que um símbolo seja inserido após outro símbolo
    if (['+', '-', 'x', '÷', '%'].includes(lastChar) && ['+', '-', 'x', '÷', '%'].includes(value)) {
        return;
    }

    // Adiciona um espaço antes do símbolo, se o anterior for um número
    if (/[0-9]/.test(lastChar) && ['+', '-', 'x', '÷', '%'].includes(value)) {
        display.value += ' ' + value + ' ';
        return;
    }

    // Adiciona o valor diretamente
    display.value += value;
}

// Função para inverter o sinal do número
function toggleSign() {
    let displayValue = display.value;
    if (displayValue.charAt(0) === '-') {
        display.value = displayValue.substring(1);
    } else {
        display.value = '-' + displayValue;
    }
}

// Função para apagar o último caractere
function deleteLastChar() {
    let displayValue = display.value.trim();
    display.value = displayValue.slice(0, -1);
}

// Função para calcular o resultado
function calculate() {
    let displayValue = display.value;
    if (displayValue === '') {
        return;
    }

    // Substituindo os sinais de operação pelos operadores corretos
    displayValue = displayValue.replace(/÷/g, '/').replace(/x/g, '*').replace(/,/g, '.');
    try {
        let result = safeEval(displayValue);
        if (isNaN(result) || !isFinite(result)) {
            display.value = 'Erro';
            return;
        }

        // Adiciona o cálculo ao histórico
        addHistoryItem(`${displayValue} = ${result}`);

        // Atualiza o display com o resultado
        display.value = result;
        lastResult = result;
    } catch (error) {
        display.value = "Erro";
    }
}

// Função para adicionar um item ao histórico
function addHistoryItem(item) {
    const formattedItem = item.replace(/\*/g, 'x');
    const historyItem = document.createElement('p');
    historyItem.textContent = formattedItem;
    historyContainer.appendChild(historyItem);

    // Manter o histórico visível com overflow
    historyContainer.scrollTop = historyContainer.scrollHeight;
}

// Função para limpar o histórico
function clearHistory() {
    historyContainer.innerHTML = ''; // Remove todos os filhos do container de histórico
}

// Impede o envio de formulário caso exista dentro da div calculadora
document.getElementById('calculadora').addEventListener('submit', function(event) {
    event.preventDefault();
});

function safeEval(expression) {
    try {
        const sanitizedExpression = expression.replace(/[^0-9+\-*/().]/g, '');
        return new Function(`return ${sanitizedExpression}`)();
    } catch (error) {
        throw new Error("Erro na avaliação da expressão: " + error);
    }
}

// Captura eventos de teclado
document.addEventListener('keydown', function(event) {
    const key = event.key;

    if (/[0-9]/.test(key)) {
        appendToDisplay(key);
    } else if (['+', '-', '*', '/'].includes(key)) {
        appendToDisplay(key); // * será mapeado para x e / para ÷
    } else if (key === 'Enter') {
        calculate();
    } else if (key === 'Backspace') {
        deleteLastChar();
    } else if (key === 'c' || key === 'C') {
        clearDisplay();
    } else if (key === '.') {
        appendToDisplay(',');
    }
});

const inputWrapper = document.querySelector('.input-wrapper');
const inputArea = document.querySelector('.input-area');
const expressionArea = document.querySelector('.expression');

const actions = {
    SIGNS: ['minus', 'mult', 'div', 'dot', 'plus'],
    CLEAR: 'clear',
    REMOVE: 'remove',
    EQUAL: 'equal',
    OPEN: 'open',
    CLOSE: 'close'
};

let isModifiedNow = true;
let expression = '0';
let expressionModified = expression;
let currentPosition = 1;

document.addEventListener("keydown", (event) => {
    const key = event.key;
    if (key.match('[0-9]')) printDigit(key);
    if (key.match('[+-.*/]')) printSign(key);
    if (key === 'Enter') solve();
    if (key === 'Backspace') remove();
});

document.querySelectorAll('.num').forEach(e => {
    e.addEventListener('click', () => printDigit(e.innerText))
});

document.querySelectorAll('.action').forEach(e => {
    e.addEventListener('click', () => {
        const actionType = e.dataset.action;

        if (actionType === actions.CLEAR) clear();
        if (actionType === actions.REMOVE) remove();
        if (actionType === actions.EQUAL) solve();
        if (actions.SIGNS.includes(actionType)) printSign(e.innerHTML);
    })
});

function printDigit(digit) {
    // if there are expression result
    if (!isModifiedNow) {
        expression = '';
        currentPosition = 0;
    }

    // if first digit is zero
    if (expression.length === 1 && expression.charAt(0) === '0') {
        removeLastSymbol();
    }

    isModifiedNow = true;
    currentPosition++;
    inputArea.innerText = expression += digit;
}

function solve() {
    isModifiedNow = false;

    expressionArea.innerText = expression + '=';

    expressionModified = expression;
    expressionModified = expressionModified.replaceAll('\u00D7', '*');
    expressionModified = expressionModified.replaceAll('\u00F7', '/');

    try {
        expression = toFixed(eval(expressionModified));

        if (expression.length > 12) {
            expression = parseFloat(expression).toPrecision(7);
        }

        currentPosition = expression.length;
        inputArea.innerText = expression;
        inputWrapper.classList.remove('error');
    } catch (e) {
        clear();
        inputArea.innerText = 'Error';
        inputWrapper.classList.add('error');
    }
}

function printSign(currentSymbol) {
    if (currentSymbol === '/') currentSymbol = '\u00F7';
    if (currentSymbol === '*') currentSymbol = '\u00D7';
    if (currentSymbol === ',') currentSymbol = '.';

    if (currentSymbol === '.' && !isModifiedNow) {
        inputArea.innerText = expression = '.';
        currentPosition = 1;
        isModifiedNow = true;
        return;
    }

    isModifiedNow = true;

    if (!(expression.charAt(currentPosition - 1)).match('[0-9]')) {
        removeLastSymbol();
    }

    expression += currentSymbol;
    currentPosition++;

    // removing extra dot if needed
    if (currentSymbol === '.' && !/^(?:(?:\d+(?:\.\d*)?|\.\d+)(?:[-+\u00F7\u00D7]|$))+$/.test(expression)) {
        removeLastSymbol();
    }

    inputArea.innerText = expression;
}

function clear() {
    isModifiedNow = false;
    inputWrapper.childNodes.forEach(i => i.innerText = '');
    expression = '0';
    currentPosition = 1;
}

function remove() {
    isModifiedNow ? removeLastSymbol() : clear();
    inputArea.innerText = expression;
}

function removeLastSymbol() {
    expression = expression.substr(0, expression.length-1);
    currentPosition--;
}

function toFixed(value) {
    const power = Math.pow(10, 10);
    return String(Math.round(value * power) / power);
}

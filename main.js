const inputWrapper = document.querySelector('.input-wrapper');
const inputArea = document.querySelector('.input-area');
const expressionArea = document.querySelector('.expression');

const actions = {
    OPERATIONS: {MINUS: 'minus', MULT: 'mult', DIV: 'div', PLUS: 'plus'},
    DOT: 'dot',
    CLEAR: 'clear',
    REMOVE: 'remove',
    EQUAL: 'equal',
    OPEN: 'open',
    CLOSE: 'close'
};

let isModified = false;
let expression = '';
let expressionModified = '';
let currentPosition = 0;


document.addEventListener("keydown", (event) => {
    if (event.key >= 0 && event.key <= 9) {
        isModified = true;
        if (expression.length === 1 && expression.charAt(0) === '0' && event.key.match('[0-9]')) {
            expression = expression.substr(0, expression.length-1);
            currentPosition--;
        }
        expression += event.key;
        currentPosition++;
        inputArea.innerText = expression;
    }

    if (event.key === 'Enter') equal();
    if (event.key.match('[\+\-\.\*\/]')) doMath(event.key);
    if (event.key === 'Backspace') remove();
});

document.querySelectorAll('.num').forEach(e => {
    e.addEventListener('click', () => {
        isModified = true;

        if (expression.length === 1 && expression.charAt(0) === '0' && e.innerHTML.match('[0-9]')) {
            expression = expression.substr(0, expression.length-1);
            currentPosition--;
        }
        expression += e.innerHTML;
        inputArea.innerText = expression;
        currentPosition++;
    })
});

document.querySelectorAll('.action').forEach(e => {
    e.addEventListener('click', () => {
        const actionType = e.dataset.action;
        const currentSymbol = e.innerHTML;

        // clear all
        if (actionType === actions.CLEAR) {
            isModified = false;
            inputWrapper.childNodes.forEach(i => i.innerText = '');
            expression = '';
            currentPosition = 0;
            return;
        }

        if (actionType === actions.REMOVE) {
            remove();
        }

        if (actionType === actions.EQUAL) {
            equal();
        }

        // math operations
        if (actions.OPERATIONS.hasOwnProperty(actionType.toUpperCase()) || actionType === actions.DOT) {
            doMath(currentSymbol);
        }
    })
});

function equal() {
    // equal
    isModified = false;
    expressionModified = expression;

    expressionModified = expressionModified.replaceAll('\u00D7', '*');
    expressionModified = expressionModified.replaceAll('\u00F7', '/');

    expressionArea.innerText = expression + '=';

    try {
        expression = toFixed(eval(expressionModified));
        inputWrapper.classList.remove('error');
    } catch (e) {
        inputWrapper.classList.add('error');
    }

    currentPosition = expression.length;

    return inputArea.innerText = expression;
}

function doMath(currentSymbol) {
    const lastSymbol = expression.charAt(currentPosition - 1);
    if (currentSymbol === '/') currentSymbol = '\u00F7';
    if (currentSymbol === '*') currentSymbol = '\u00D7';
    isModified = true;

    if (lastSymbol.match('[0-9]')) {
        expression += currentSymbol;
        currentPosition++;
    } else if (currentPosition === 0 && currentSymbol.match('[\+\-\.\u00D7\u00F7]')) {
        expression += '0' + currentSymbol;
        currentPosition = 2;
    } else {
        expression = expression.substr(0, expression.length - 1); // replace operation
        expression += currentSymbol;
    }

    return inputArea.innerText = expression;
}

function remove() {
    console.log(isModified)
    if (isModified) {
        expression = expression.substr(0, expression.length - 1);
        currentPosition--;
        return inputArea.innerText = expression;
    }
}

function toFixed(value) {
    var power = Math.pow(10, 10);
    return String(Math.round(value * power) / power);
}

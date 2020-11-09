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

let isModified = false;
let expression = '';
let expressionModified = '';
let currentPosition = 0;
let ans = '';

document.addEventListener("keydown", (event) => {
    const key = event.key;
    if (key.match('[0-9]')) digitInput(key);
    if (key.match('[\+\-\.\*\/]')) doMath(key);
    if (key === 'Enter') equal();
    if (key === 'Backspace') remove();
});

document.querySelectorAll('.num').forEach(e => {
    e.addEventListener('click', () => digitInput(e.innerText))
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
            ans = '';
            currentPosition = 0;
        }

        if (actionType === actions.REMOVE) {
            remove();
        }

        if (actionType === actions.EQUAL) {
            equal();
        }

        // math operations
        if (actions.SIGNS.includes(actionType)) {
            doMath(currentSymbol);
        }
    })
});


// input digit
function digitInput(digit) {
    // if there are expression result
    if (ans !== '' && !isModified) {
        expression = '';
        currentPosition = 0;
    }

    isModified = true;


    if (expression.length === 1 && expression.charAt(0) === '0') {
        expression = expression.substr(0, expression.length-1);
        currentPosition--;
    }

    // expression += digit;
    currentPosition++;
    inputArea.innerText = expression += digit;
}

function equal() {
    isModified = false;

    expressionModified = expression;
    expressionModified = expressionModified.replaceAll('\u00D7', '*');
    expressionModified = expressionModified.replaceAll('\u00F7', '/');

    expressionArea.innerText = expression + '=';

    try {
        expression = toFixed(eval(expressionModified));
        ans = expression;
        currentPosition = expression.length;
        if (expression.length > 12) {
            expression = parseFloat(expression).toPrecision(7);
        }
        inputArea.innerText = expression;
        inputWrapper.classList.remove('error');
    } catch (e) {
        expression = '';
        expressionArea.innerText = 'Ans = ' + ans;
        currentPosition = 0;
        inputArea.innerText = 'Error';
        inputWrapper.classList.add('error');
    }
}

function doMath(currentSymbol) {
    const lastSymbol = expression.charAt(currentPosition - 1);
    if (currentSymbol === '/') currentSymbol = '\u00F7';
    if (currentSymbol === '*') currentSymbol = '\u00D7';

    if (currentSymbol === '.' && ans !== '' && !isModified) {
        expression = '.';
        inputArea.innerText = expression;
        currentPosition = 1;
        isModified = true;
        return;
    }

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

    inputArea.innerText = expression;
}


// remove
function remove() {
    console.log(isModified)
    if (isModified) {
        expression = expression.substr(0, expression.length - 1);
        currentPosition--;
        inputArea.innerText = expression;
    } else {
        isModified = false;
        expressionArea.innerText = 'Ans = ' + ans;
        expression = '';
        currentPosition = 0;
        inputArea.innerText = expression;
    }
}

function toFixed(value) {
    var power = Math.pow(10, 10);
    return String(Math.round(value * power) / power);
}




// data for the app

var BUDGET = 0;
var INCOME_TOTAL = 0;
var EXPENSES_TOTAL = 0;
var EXPENSES_PERCENTAGE = -1;

var INCOME_LIST = [];
var EXPENSES_LIST = [];

class IncomeItem {

    static counter = 1; // Static property to keep track of the ID

    constructor(description, value) {
        this.id = 'income-' + IncomeItem.counter++;
        this.type = 'income';
        this.description = description;
        this.value = value;
    }
}

class ExpenseItem {

    static counter = 1;

    constructor(description, value) {
        this.id = 'expense-' + ExpenseItem.counter++;
        this.type = 'expense';
        this.description = description;
        this.value = value;
        this.calculatePercentage();
    }

    calculatePercentage() {
        if (INCOME_TOTAL > 0) {
            this.percentage = this.value * 100 / INCOME_TOTAL;
        } else {
            this.percentage = -1;
        }
    }
}


// Library of strings for DOM Manipulation 
var DOMstrings = {
    currentMonthLabel: ".budget__title--month",
    budgetLabel: ".budget__value",
    totalIncomeLabel: ".budget__income--value",
    totalExpensesLabel: ".budget__expenses--value",
    totalExpensePercentLabel: ".budget__expenses--percentage",
    incomeContainer: ".income__list",
    expenseContainer: ".expenses__list",
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    addButton: ".add__btn",
    deleteButton: ".item__delete--btn",
    expensePercentage: ".item__percentage"
};


// initialize function
function init() {

    // display current month and year
    (() => {
        var today = new Date()

        year = today.getFullYear();
        month = today.toLocaleDateString('default', { month: 'long' });

        document.querySelector(DOMstrings.currentMonthLabel).textContent = month + ' ' + year
    })();

    // display total income and expenses
    displayTotalIncome();
    displayTotalExpenses();
    displayPercentageOfTotalExpenses();

    // display total budget
    displayBudget();

    // display income items
    INCOME_LIST.forEach(item => {
        displayItem(item, item.type);
    });

    // display expense items
    EXPENSES_LIST.forEach(item => {
        displayItem(item, item.type);
    });

    // FOR TESTING ONLY ...
    // Dummy list for income items
    // const incomeList = [
    //     new IncomeItem('Salary', 3000),
    //     new IncomeItem('Freelance Work', 1500),
    //     new IncomeItem('Royalties', 250)
    // ];
    // addIncomeItem('Salary', 3000);

    // Dummy list for expense items
    // const expenseList = [
    //     new ExpenseItem('Rent', 1000),
    //     new ExpenseItem('Groceries', 300),
    //     new ExpenseItem('Utilities', 200)
    // ];
    // addExpenseItem('Rent', 1000);
}


function onAddItem() {

    var newItem = getItemInput();

    if (newItem.type === 'income') {
        addIncomeItem(newItem.description, newItem.value);
    }

    if (newItem.type === 'expense') {
        addExpenseItem(newItem.description, newItem.value);
    }
}

function onDeleteItem() {

}


// add item functions
function addIncomeItem(inputDescription, inputValue) {

    // create an income object
    incomeObj = new IncomeItem(inputDescription, parseFloat(inputValue));

    // add the obj in income list
    updateIncomeList(incomeObj);

    // update total income
    updateTotalIncome(incomeObj.value);

    // update budget value
    updateBudget();

    // update expense percentages for total and for individual expense items
    updateTotalExpensesPercentage();
    updateExpenseItemPercentages();

    /* 
        update the UI
        1. item appears in the income list and add event lister to it
        2. total income
        3. budget
        4. total percent of expenses
        5. individual percents of expense items
        6. input fields reset
    */
    displayItem(incomeObj, incomeObj.type);
    displayTotalIncome();
    displayBudget();
    displayPercentageOfTotalExpenses();
    displayPercentageOfExpenseItems();
    resetInputFields()
}


function addExpenseItem(inputDescription, inputValue) {

    // create an expense object
    expenseObj = new ExpenseItem(inputDescription, parseFloat(inputValue));

    // add the obj in expense list
    updateExpensesList(expenseObj);

    // update total expenses
    updateTotalExpenses(expenseObj.value);

    // update budget value
    updateBudget();

    // update expense percentages for total expense items
    updateTotalExpensesPercentage();

    /*
        update the UI
        1. item appears in the expenses list and add event lister to it
        2. total income
        3. budget
        4. total percent of expenses
        5. input fields reset
    */
    displayItem(expenseObj, expenseObj.type);
    displayTotalExpenses();
    displayBudget();
    displayPercentageOfTotalExpenses();
    resetInputFields();
}


// UI display functions
function displayItem(item, type) {

    var htmlString = '', itemContainer;

    if (type === 'income') {
        itemContainer = DOMstrings.incomeContainer;
        htmlString = `
            <div class="item clearfix" id="${item.id}">
                <div class="item__description">${item.description}</div>
                <div class="right clearfix">
                <div class="item__value">${formatNumber(item.value, item.type)}</div>
                <div class="item__delete">
                    <button class="item__delete--btn">
                    <i class="ion-ios-close-outline"></i>
                    </button>
                </div>
                </div>
            </div>
        `;
    }
    if (type === 'expense') {
        itemContainer = DOMstrings.expenseContainer;
        htmlString = `
            <div class="item clearfix" id="${item.id}">
            <div class="item__description">${item.description}</div>
            <div class="right clearfix">
                <div class="item__value">${formatNumber(item.value, item.type)}</div>
                <div class="item__percentage">${Math.round(item.percentage)}%</div>
                <div class="item__delete">
                <button class="item__delete--btn">
                    <i class="ion-ios-close-outline"></i>
                </button>
                </div>
            </div>
            </div>
        `;
    }

    document.querySelector(itemContainer).insertAdjacentHTML('beforeend', htmlString);
}

function displayBudget() {
    var budgetType = 'income';  // by default budget is positive
    if (BUDGET < 0) {
        budgetType = 'expense'
    }
    document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(BUDGET, budgetType);
}

function displayTotalIncome() {
    document.querySelector(DOMstrings.totalIncomeLabel).textContent = formatNumber(INCOME_TOTAL, 'income');
}

function displayTotalExpenses() {
    document.querySelector(DOMstrings.totalExpensesLabel).textContent = formatNumber(EXPENSES_TOTAL, 'expense');
}

function displayPercentageOfTotalExpenses() {
    const expensePercentageLabel = EXPENSES_PERCENTAGE > 0 ? Math.round(EXPENSES_PERCENTAGE) + '%' : '---';
    document.querySelector(DOMstrings.totalExpensePercentLabel).textContent = expensePercentageLabel;
}

function displayPercentageOfExpenseItems() {
    EXPENSES_LIST.forEach(expense => {
        const percentageLabel = expense.percentage > 0 ? Math.round(expense.percentage) + '%' : '---';
        const expenseElement = document.getElementById(expense.id);
        if (expenseElement) {
            const percentageElement = expenseElement.querySelector(DOMstrings.expensePercentage);
            if (percentageElement) {
                percentageElement.textContent = percentageLabel;
            }
        }
    });
}

function getItemInput() {
    const inputType = document.querySelector(DOMstrings.inputType).value;
    const inputValue = document.querySelector(DOMstrings.inputValue).value;
    const inputDescription = document.querySelector(DOMstrings.inputDescription).value;

    // TODO: add validation checks before returning

    return {
        type: inputType,
        description: inputDescription,
        value: inputValue
    };
}

function resetInputFields() {
    document.querySelector(DOMstrings.inputType).value = 'income';
    document.querySelector(DOMstrings.inputValue).value = '';
    document.querySelector(DOMstrings.inputDescription).value = '';
}

function formatNumber(number, type) {
    /* 
        returns number as a string
        1. all numbers are displayed up to 2 decimal places
        2. prefixed by + for income and - for expenses
        3. comma separated after 3 digits
        4. Special case: No special formatting for 0
    */

    if (number == 0) {
        return '0';
    }

    number = Math.abs(number);

    numberString = number.toFixed(2);

    let [integerPart, decimalPart] = numberString.split('.');

    integerPart = parseFloat(integerPart).toLocaleString('en-US');

    numberString = integerPart + '.' + decimalPart;

    let sign;
    switch (type) {
        case 'income':
            sign = '+';
            break;
        case 'expense':
            sign = '-';
            break;
        default:
        // invalid type parameter
    }

    numberString = sign + ' ' + numberString;

    return numberString;
}


// data update functions
function updateBudget() {
    BUDGET = INCOME_TOTAL - EXPENSES_TOTAL;
}

function updateIncomeList(newIncomeObj) {
    INCOME_LIST.push(newIncomeObj);
}

function updateTotalIncome(newIncomeValue) {
    INCOME_TOTAL += newIncomeValue;
}

function updateExpensesList(newExpenseObj) {
    EXPENSES_LIST.push(newExpenseObj);
}

function updateTotalExpenses(newExpenseValue) {
    EXPENSES_TOTAL += newExpenseValue;
}

function updateTotalExpensesPercentage() {
    if (INCOME_TOTAL > 0) {
        EXPENSES_PERCENTAGE = EXPENSES_TOTAL * 100 / INCOME_TOTAL;
    } else {
        EXPENSES_PERCENTAGE = -1;
    }
}

function updateExpenseItemPercentages() {
    EXPENSES_LIST.forEach((expense) => {
        expense.calculatePercentage();
    });
}


// initialize app
init();

// event listeners
document.querySelector(DOMstrings.addButton).addEventListener('click', onAddItem);
// document.querySelector(DOMstrings.deleteButton).addEventListener('click', onDeleteItem); (add this in runtime)

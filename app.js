var budgetController = (function() {

	var Expense = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var Income = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var calculateTotal = function(type) {
		var sum = 0;
		data.allItems[type].forEach(function(cur) {
			sum += cur.value;
		});

		data.totals[type] = sum;
	};

	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		},
		budget: 0,
		percentage: -1
	};

	return {
		addItem: function(type, des, val) {
			var newItem, ID;

			// get the id, grab last item in the array + 1
			if(data.allItems[type].length > 0) {
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			} else {
				ID = 0;
			}

			// add new item
			if(type === 'exp') {
				newItem = new Expense(ID, des, val);
			} else if(type === 'inc') {
				newItem = new Income(ID, des, val);
			}

			// select array with [type] accordingly and push
			data.allItems[type].push(newItem);
			// return new element
			return newItem;
			
		},

		calculateBudget: function() {
			// calculate total income and expenses
			calculateTotal('exp');
			calculateTotal('inc');

			// calculate inc - exp
			data.budget = data.totals.inc - data.totals.exp;

			// calc. percentage spent
			if(data.totals.inc > 0) {
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			} else {
				data.percentage = -1;
			}
		},

		getBudget: function() {
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			}
		},

		testing: function() {
			console.log(data);
		}
	};

})();



// UI

var UIController = (function() {

	var DOMStrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputVal: '.add__value',
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expensesContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expensesLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage',
		itemContainer: '.item-container'
	};

	// get input and return, closure
	// define public method
	return {
		getInput: function() {
			return {
				type: document.querySelector(DOMStrings.inputType).value, // inc or exp
				description: document.querySelector(DOMStrings.inputDescription).value,
				value: parseFloat(document.querySelector(DOMStrings.inputVal).value)
			}
		},

		addListItem: function(obj, type) {
			var html, newHtml, element;

			// add placeholder html
			if(type === 'inc') {
				element = DOMStrings.incomeContainer;

	            html = '<div class="item clearfix" id="inc-%id%">' + 
	                '<div class="item__description">%description%</div>' + 
	                '<div class="right clearfix">' +
	                    '<div class="item__value">%value%</div>' +
	                    '<div class="item__delete">' + 
	                        '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>' + 
	                    '</div>' + 
	                '</div>' + 
	            '</div>';

			} else if(type === 'exp') {
				element = DOMStrings.expensesContainer;

	            html = '<div class="item clearfix" id="exp-%id%">' + 
	                '<div class="item__description">%description%</div>' + 
	                '<div class="right clearfix">' +
	                    '<div class="item__value">%value%</div>' +
	                    '<div class="item__percentage">21%</div>' + 
	                    '<div class="item__delete">' + 
	                        '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>' + 
	                    '</div>' + 
	                '</div>' + 
	            '</div>';
			}

			// replace placeholder w/data
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', obj.value);

			// inject html as child
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

		},

		clearFields: function() {
			var fields, fieldsArr;

			fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputVal);

			// querySelectorAll returns list, need to convert it into an array
			// call slice method from the Array prototype
			// and set 'this' to 'fields'
			// slice thinks it gets an array so it returns an array
			fieldsArr = Array.prototype.slice.call(fields);

			fieldsArr.forEach(function(current, index, array) {
				current.value = '';
			});

			fieldsArr[0].focus();
		},

		displayBudget: function(obj) {
			document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
			document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
			document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExp;

			if(obj.percentage > 0) {
				document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
			} else {
				document.querySelector(DOMStrings.percentageLabel).textContent = '---';
			}
		},

		getDOMStrings: function() {
			return DOMStrings; // expose DOMStrings
		}
	};

})();



// controller here

var controller = (function(budgetCtrl, UICtrl) {

	// event listeners here
	var setupEventListeners = function() {

		var DOM = UICtrl.getDOMStrings();

		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

		document.addEventListener('keypress', function(e) {
			if(e.keycode === 13 || e.which === 13) {
				ctrlAddItem();
			}
		});

		document.querySelector(DOM.itemContainer).addEventListener('click', ctrlDeleteItem);
	};

	var updateBudget = function() {
		// calculate budget
		budgetCtrl.calculateBudget();

		// return budget
		var budget = budgetCtrl.getBudget();

		// display budget in the UI
		UICtrl.displayBudget(budget);
	};

	var ctrlAddItem = function() {
		var input, newItem;

		// get input data
		input = UICtrl.getInput(); // call public method

		if(input.description !== '' && !isNaN(input.value) && input.value > 0) {
			// add item to budget controller
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);

			// add item to UI
			UICtrl.addListItem(newItem, input.type);

			// clear input fields
			UICtrl.clearFields();

			// calculate and update budget
			updateBudget();
		}
	};

	// delete items and update new budget
	var ctrlDeleteItem = function(event) {
		var itemID, splitID, type, ID;

		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

		if(itemID) {
			// inc-1
			splitID = itemID.split('-');
			type = splitID[0];
			ID = splitID[1];

			// delete item from data structure

			// delete item from UI

			// update new budget
		}
	};


	// public init
	return {
		init: function() {
			UICtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1
			});
			setupEventListeners();
		}
	}

})(budgetController, UIController); // pass UICtrl and budgetCtrl as arguments and invoke

controller.init();








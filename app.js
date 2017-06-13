var budgetController = (function() {

	var Expense = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = -1;
	};

	// set percentage calculation method on a prototype
	Expense.prototype.calcPercentage = function(totalIncome) {
		if(totalIncome > 0) {
			this.percentage = Math.round((this.value / totalIncome) * 100);
		} else {
			this.percentage = -1;
		}
	};

	Expense.prototype.getPercentage = function() {
		return this.percentage;
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


		deleteItem: function(type, id) {
			var ids, index;

			//use map to return brand new array
			ids = data.allItems[type].map(function(current) {
				return current.id;
			});

			// get the index of specific item
			index = ids.indexOf(id);

			// delete item if there is any
			if(index !== -1) {
				data.allItems[type].splice(index, 1);
			}
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

		calculatePercentages: function() {
			data.allItems.exp.forEach(function(cur) {
				cur.calcPercentage(data.totals.inc);
			});
		},

		getPercentages: function() {
			var allPerc = data.allItems.exp.map(function(cur) {
				return cur.getPercentage();
			});
			return allPerc;
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
		itemContainer: '.item-container',
		expensesPercLabel: '.item__percentage'
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

		deleteListItem: function(selectorID) {
			var el = document.getElementById(selectorID);
			el.parentNode.removeChild(el);
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

		displayPercentages: function(percentages) {
			// get node list
			var fields = document.querySelectorAll(DOMStrings.expensesPercLabel);

			var nodeListForEach = function(nodeList, callback) {
				for(var i = 0; i < nodeList.length; i++) {
					callback(nodeList[i], i);
				}
			};

			nodeListForEach(fields, function(current, index) {
				if(percentages[index] > 0) {
					current.textContent = percentages[index] + '%';
				} else {
					current.textContent = '---';
				}
			});
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

	var updatePercentages = function() {
		// calculate percentages
		budgetCtrl.calculatePercentages();

		// read % from budget controller
		var percentages = budgetCtrl.getPercentages();

		// update UI
		UICtrl.displayPercentages(percentages);
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

			// calculate and update percentages
			updatePercentages();
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
			// split will return an array with two strings, convert to number
			ID = parseInt(splitID[1]);

			// delete item from data structure
			budgetCtrl.deleteItem(type, ID);

			// delete item from UI
			UICtrl.deleteListItem(itemID);

			// update new budget
			updateBudget();

			// calculate and update percentages
			updatePercentages();
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








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

	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		}
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
		inputBtn: '.add__btn'
	};

	// get input and return, closure
	// define public method
	return {
		getInput: function() {
			return {
				type: document.querySelector(DOMStrings.inputType).value, // inc or exp
				description: document.querySelector(DOMStrings.inputDescription).value,
				value: document.querySelector(DOMStrings.inputVal).value
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
	};

	var ctrlAddItem = function() {
		var input, newItem;

		// get input data
		input = UICtrl.getInput(); // call public method
		
		// add item to budget controller
		newItem = budgetCtrl.addItem(input.type, input.description, input.value);
	};

	// public init
	return {
		init: function() {
			setupEventListeners();
		}
	}

})(budgetController, UIController); // pass UICtrl and budgetCtrl as arguments and invoke

controller.init();








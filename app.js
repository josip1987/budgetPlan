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
			exp: = [],
			inc: = []
		},
		totals: {
			exp: 0,
			inc: 0
		}
	}

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
		// get input data
		var input = UICtrl.getInput(); // call public method
		console.log(input);
	};

	// public init
	return {
		init: function() {
			setupEventListeners();
		}
	}

})(budgetController, UIController); // pass UICtrl and budgetCtrl as arguments and invoke

controller.init();








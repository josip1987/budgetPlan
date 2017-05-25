var budgetController = (function() {

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

	var DOM = UICtrl.getDOMStrings();

	var ctrlAddItem = function() {
		var input = UICtrl.getInput(); // call public method
		console.log(input);
		console.log(DOM);
	}

	document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

	document.addEventListener('keypress', function(e) {
		if(e.keycode === 13 || e.which === 13) {
			ctrlAddItem();
		}
	});

})(budgetController, UIController); // pass UICtrol and budgetCtrol as arguments and invoke










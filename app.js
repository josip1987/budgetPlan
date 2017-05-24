var budgetController = (function() {

	var x = 23;

	var add = function(a) {
		return x + a;
	}

	// iife closure

	return {
		publicTest: function(b) {
			console.log(add(b));
		}
	}

})();



// UI

var UIController = (function() {

})();



// controller here

var controller = (function(budgetCtrl, UICtrl) {


})(budgetController, UIController); // pass UICtrol and budgetCtrol as arguments and invoke










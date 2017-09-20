window.onload = function() {
	document.getElementById("hunt").addEventListener('click', function() {

		var bld = change_blood('+', 1),
			en = change_energy('-', 1),
			exp = change_experience('+', 1);
		document.getElementById("blood").innerHTML = bld;
		document.getElementById("energy").innerHTML = en;
		document.getElementById("experience").innerHTML = exp;
		
		if (en <= 0) {
			document.getElementById("night").innerHTML = change_night('+', 1);
			document.getElementById("blood").innerHTML = change_blood('-', 1);
			document.getElementById("energy").innerHTML = change_energy('+', Math.abs(en) + 1);
			
			if (bld <= 0) { 
				window.alert("You have failed to acquire enough blood to survive the day.\n" + 
					"Your corpse does not rise at dusk.\n" + 
					"The End.");
			}
		}
	}, false);
};

var change_blood = (function () {
    var counter = 1;
    return function (op, amt) {
		if (op == '+') return counter += amt;
		else if (op == '-') return counter -= amt;
	}
})();

var change_energy = (function () {
    var counter = 1;
    return function (op, amt) {
		if (op == '+') return counter += amt;
		else if (op == '-') return counter -= amt;
	}
})();

var change_experience = (function () {
    var counter = 0;
    return function (op, amt) {
		if (op == '+') return counter += amt;
		else if (op == '-') return counter -= amt;
	}
})();

var change_night = (function () {
    var counter = 0;
    return function (op, amt) {
		if (op == '+') return counter += amt;
		else if (op == '-') return counter -= amt;
	}
})();
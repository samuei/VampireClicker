import { vamp_load_vals, flavor_events, hunt_encounters, nests } from './constants.js';

window.onload = function() {
	// Listeners
	document.getElementById("hunt").addEventListener('click', function() {hunt()}, false);
	document.getElementById("save").addEventListener('click', function() {save()}, false);
	document.getElementById("delete_save").addEventListener('click', function() {delete_save()}, false);
	
	// Check for localStorage
	if (typeof(Storage) !== "undefined") {
		if(localStorage.blood) {
			// Making the quick and dirty assumption that if there is any saved data, all data was saved.
			// I recognize the danger in this.
			vamp_load_vals.forEach(
				function (val) {
					vamp_object[val] = parseInt(localStorage.getItem(val), 10);
					var el = document.getElementById(val);
					if (el) el.innerHTML = vamp_object[val];
				}
			);
			
			// Handle money upgrades
			vamp_object.money_flag = parseInt(localStorage.money_flag, 10);
			
			if (vamp_object.money_flag) {
				document.getElementById("money_outer").style.display = 'inline';
				document.getElementById('mechanics_upgrades').style.display = 'block';
			}
			else if (vamp_object.experience >= 10) {
				var loot_unlock_butt = document.createElement('button');
				loot_unlock_butt.id = 'loot_unlock_butt';
				loot_unlock_butt.innerHTML = 'Loot victims: 10 xp';
				document.getElementById('mechanics_upgrades').appendChild(loot_unlock_butt);
				loot_unlock_butt.addEventListener('click', function() {loot_unlock()}, false);
				document.getElementById('mechanics_upgrades').style.display = 'block';
			}
			
			// Handle energy upgrades
			vamp_object.energy_upgrade_flag = localStorage.energy_upgrade_flag;
			
			if (vamp_object.energy_upgrade_flag) {
				var energy_upgrade_butt = document.createElement('button');
				energy_upgrade_butt.id = 'energy_upgrade_butt';
				energy_upgrade_butt.innerHTML = 'Infuse Muscles With Blood: ' + vamp_object.energy_upgrade_cost + ' blood';
				document.getElementById('mechanics_upgrades').appendChild(energy_upgrade_butt);
				energy_upgrade_butt.addEventListener('click', function() {energy_upgrade()}, false);
			}
			
			// Handle housing upgrades
			if (vamp_object.nest < 0 && vamp_object.experience >= 25) {
				var nest_unlock_butt = document.createElement('button');
				nest_unlock_butt.id = 'nest_unlock_butt';
				nest_unlock_butt.innerHTML = 'Seek Housing: 25 xp';
				document.getElementById('mechanics_upgrades').appendChild(nest_unlock_butt);
				nest_unlock_butt.addEventListener('click', function() {nest_unlock()}, false);
			}
			
			message(localStorage.buffer);
			message('Loaded from localStorage'); // Not the other way around, because then you'd never see this
		}
	}
	else {
		// No sense trying to store things if storage isn't a thing
		document.getElementById("save").style.display = 'none';
		document.getElementById("delete_save").style.display = 'none';
	}
};

// Primary game object
var vamp_object = {
	blood : 1,
	energy : 1,
	energy_max : 1,
	experience : 0,
	money : 0,
	night : 1,
	energy_upgrade_cost : 3,
	buffer : "You are a blood-sucking creature of the night. <br> " +
		"<br>You require the blood of the living to animate your soulless corpse every sunset. " + 
		"<br>Perhaps as you grow and learn about the night, you will become able to do more than simply feed and sleep. " + 
		"<br>Perhaps. Or perhaps not. ",
	nest: -1,
	
	// Flags
	money_flag : 0,
	energy_upgrade_flag : false,
};

/*
 * Actions
 */

// Spend one energy hunting for food
function hunt() {
	// Update object values
	vamp_object.blood += 1;
	vamp_object.energy -= 1;
	vamp_object.experience += 1;
	
	// Feeding message
	var rand = Math.floor(Math.random() * 9),
		rand2 = Math.floor(Math.random() * (vamp_object.money_flag + 1));
	message(hunt_encounters[rand2][rand].message);
	if (hunt_encounters[rand2][rand].energy_add) {
		vamp_object.energy += hunt_encounters[rand2][rand].energy_add;
		message('<span class="shaky_text">You feel energized!</span> ');
	}
	
	// Money, if applicable
	rand = Math.floor(Math.random() * 9);
	var money_gained = (rand * vamp_object.money_flag)
	vamp_object.money += money_gained;
	document.getElementById("money").innerHTML = vamp_object.money;
	if (money_gained) message('You abscond with $'+money_gained);
	
	// Speaking of the applicability of money...
	if (vamp_object.money_flag == 0 && vamp_object.experience == 10) {
		var loot_unlock_butt = document.createElement('button');
		loot_unlock_butt.id = 'loot_unlock_butt';
		loot_unlock_butt.innerHTML = 'Loot victims: 10 xp';
		document.getElementById('mechanics_upgrades').appendChild(loot_unlock_butt);
		loot_unlock_butt.addEventListener('click', function() {loot_unlock()}, false);
		document.getElementById('mechanics_upgrades').style.display = 'block';
	}
	
	// Unlock energy upgrades, if applicable
	if (!vamp_object.energy_upgrade_flag && vamp_object.blood >= vamp_object.energy_upgrade_cost) {
		vamp_object.energy_upgrade_flag = true;
		var energy_upgrade_butt = document.createElement('button');
		energy_upgrade_butt.id = 'energy_upgrade_butt';
		energy_upgrade_butt.innerHTML = 'Infuse Muscles With Blood: ' + vamp_object.energy_upgrade_cost + ' blood';
		document.getElementById('mechanics_upgrades').appendChild(energy_upgrade_butt);
		energy_upgrade_butt.addEventListener('click', function() {energy_upgrade()}, false);
	}
	
	// Unlock housing, if applicable
	if (vamp_object.nest < 0 && vamp_object.experience >= 25 && !document.getElementById('nest_unlock_butt')) {
		var nest_unlock_butt = document.createElement('button');
		nest_unlock_butt.id = 'nest_unlock_butt';
		nest_unlock_butt.innerHTML = 'Seek Housing: 25 xp';
		document.getElementById('mechanics_upgrades').appendChild(nest_unlock_butt);
		nest_unlock_butt.addEventListener('click', function() {nest_unlock()}, false);
	}
	
	// Flavor events
	rand = Math.floor(Math.random() * 101);
	if (flavor_events[rand]) message(flavor_events[rand]);
	
	// Update HTML values
	document.getElementById("blood").innerHTML = vamp_object.blood;
	document.getElementById("energy").innerHTML = vamp_object.energy;
	document.getElementById("experience").innerHTML = vamp_object.experience;
	
	// Energy check
	if (vamp_object.energy <= 0) {
		end_night();
	}	
};

// End the night
function end_night() {
	// Update object values
	vamp_object.night += 1;
	vamp_object.blood -= 1;
	vamp_object.energy = vamp_object.energy_max; // Reset energy.
	
	// Update HTML values
	document.getElementById('night').innerHTML = vamp_object.night;
	document.getElementById('blood').innerHTML = vamp_object.blood;
	document.getElementById('energy').innerHTML = vamp_object.energy;
	
	message('<span class="end_night_text">You slink back to your nest before dawn.</span> ');
	
	// Death check
	if (vamp_object.blood <= 0) { 
		message('<br>You have failed to acquire enough blood to survive the day.<br>' + 
			'Your corpse does not rise at dusk.<br><br>' + 
			'The End.<br>');
		document.getElementById('hunt').style.display = 'none';
		document.getElementById('mechanics_upgrades').style.display = 'none';
		document.getElementById('stats_upgrades_and_listing').style.display = 'none';
		document.getElementById("save").style.display = 'none'; // Oh, no you don't.
		return;
	}
};

// Unlock money
function loot_unlock() {
	if (vamp_object.experience < 10) {
		message('You have not learned quite enough, yet.');
		return;
	}
	document.getElementById('loot_unlock_butt').style.display = 'none';
	vamp_object.money_flag = 1;
	document.getElementById('money_outer').style.display = 'inline';
	vamp_object.experience-= 10;
	document.getElementById('experience').innerHTML = vamp_object.experience;
	message('Memories of life trickle in with the blood, and you remember...<i>money</i>. ');
};

// Energy upgrade: It's like red bull, but made of blood.
function energy_upgrade() {
	if (vamp_object.blood < vamp_object.energy_upgrade_cost) {
		message('You do not have enough blood.');
		return;
	}
	vamp_object.blood-= vamp_object.energy_upgrade_cost;
	vamp_object.energy_max += 1;
	vamp_object.energy += 1;
	vamp_object.energy_upgrade_cost = Math.floor(1.3 * vamp_object.energy_upgrade_cost) + 10; // Raise cost incrementally
	document.getElementById('blood').innerHTML = vamp_object.blood;
	document.getElementById('energy').innerHTML = vamp_object.energy;
	document.getElementById('energy_max').innerHTML = vamp_object.energy_max;
	document.getElementById('energy_upgrade_butt').innerHTML = 'Infuse Muscles With Blood: ' + vamp_object.energy_upgrade_cost + ' blood';
	message('You suffuse your muscles with the power of the Blood, and they swell with vigor. ');
};

// Unlock nests
function nest_unlock() {
	if (vamp_object.experience < 25) {
		message('You have not learned quite enough, yet.');
		return;
	}
	document.getElementById('nest_unlock_butt').style.display = 'none';
	vamp_object.nest = 0;
	vamp_object.experience -= 25;
	document.getElementById('experience').innerHTML = vamp_object.experience;
	document.getElementById('stats_upgrades_and_listing').style.display = 'block';
	
	// TODO: put housing stuff in there.
	
	
	message('You take stock of the places you have been hiding from the sun. ');
	message('Perhaps you could find some place safer...and cleaner. ');
};

// Update buffer with new text
function message(in_text) {
	// Join the buffer with the new text
	var split_buffer = vamp_object.buffer.split('<br>').concat(in_text.split('<br>'));
	// Only want the last 10 lines
	if (split_buffer.length > 10) {
		split_buffer = split_buffer.slice(-10);
	}
	// Rejoin and update buffer
	vamp_object.buffer = split_buffer.join('<br>');
	document.getElementById("center_panel").innerHTML = vamp_object.buffer;
};

// Save to localStorage
function save() {
	vamp_load_vals.forEach(
		function (val) {
			localStorage[val] = vamp_object[val];
		}
	);
	
	// Also save special stuff:
	localStorage.money_flag = vamp_object.money_flag;
	localStorage.energy_upgrade_flag = vamp_object.energy_upgrade_flag;
	localStorage.buffer = vamp_object.buffer;
};

// Wipe save from localStorage
function delete_save() {
	vamp_load_vals.forEach(
		function (val) {
			localStorage.removeItem(val);
		}
	);
		
	// Also delete special stuff:
	localStorage.removeItem('money_flag');
	localStorage.removeItem('energy_upgrade_flag');
	localStorage.removeItem('buffer');
	
	message('Your local save has been wiped clean.');
};


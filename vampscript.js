var vamp_load_vals = [
	'blood', 
	'energy', 
	'energy_max', 
	'experience', 
	'night', 
	'money', 
	'energy_upgrade_cost'
];
// special vals: money_flag, energy_upgrade_flag, buffer

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
	energy_upgrade_cost : 5,
	buffer : "You are a blood-sucking creature of the night. <br> " +
		"<br>You require the blood of the living to animate your soulless corpse every sunset. " + 
		"<br>Perhaps as you grow and learn about the night, you will become able to do more than simply feed and sleep. " + 
		"<br>Perhaps. Or perhaps not. ",
	
	// Flags
	money_flag : 0,
	energy_upgrade_flag : false,

	// Text storage
	flavor_events : {
		1 : 'A truck labeled "Demeter Shipping" nearly runs you over.',
		2 : 'Somewhere, a car alarm blares.',
		3 : 'You hear a woman scream in the distance.',
		4 : 'You pass by a man crying at a bus stop.',
		5 : 'You aren\'t sure if that\'s fog or evaporated sewage, and you don\'t want to know.',
		6 : 'You could swear you heard a music box, but when you stop to listen, there is nothing.',
		7 : 'A sinister fog rolls over the city.',
		8 : 'It seems like there are more rats than usual, but how could you tell?',
		9 : 'You feel as if you\'re being watched.',
		10 : 'A bat flies overhead.',
		11 : 'A wolf howls somewhere, sending a shiver down your spine'
	},
	
	hunt_encounters : {
		0 : {
			0 : 'The prostitute\'s blood is sour, and it feels gummy in your veins.',
			1 : 'You corner a homeless man and take your fill.',
			2 : 'You find a junkie and drink from her during a stupor. You feel dizzy and a little confused.',
			3 : 'You meet a goth woman who opens a vein for you willingly.',
			4 : 'An old lady is walking her cat. Neither one offers up much resistance.',
			5 : 'A teenager is closing up a drive-thru, and his dead eyes don\'t notice you. His blood is almost lifeless.',
			6 : 'A drunk falls face-first into the bush you\'re prowling through. It must be fate.',
			7 : 'You find a teenage boy slipping home from his girlfriend\'s bedroom. Call it a happy meal.',
			8 : 'The amateur astronomer is too busy with her telescope to notice your approach.'
		},
		1 : {
			0 : 'Willie-Joe didn\'t have much in the cab of his truck, but he had plenty of blood in his veins.',
			1 : 'You come upon a man playing an accordian for street change. You take his blood, take his change, and break his accordian.',
			2 : 'You are mugged by a man you affectionately come to know as "Dinner."',
			3 : 'You find yourself on a college campus. The professor\'s blood is not as dry as his lectures.',
			4 : 'A policewoman walks right next to the bush you are feeding in. You should be more careful.',
			5 : 'The hipster\'s blood comes with a free venti soy no-foam half-caf vanilla latte with vegan caramel drizzle. Score!',
			6 : 'You encounter a LARPer, separated from his group. His healing potions turn out to be jello shots. Huh.',
			7 : 'A local community theater is doing a Carmilla stage show. You give the actress in the title role a realistic pallor.',
			8 : 'You don\'t want to sound cliche, but if the street-corner fortune teller didn\'t see this coming, it was her own fault.'
		}
	},
	
	nests : {
		0 : {
			name : 'Wherever you can find',
			rent : 0,
			rent_increment : 0,
			description : 'Whether in a dumpster or a long culvert, you simply crawl into a safe-looking spot near the dawn.'
		},
		1 : {
			name : 'Sewer',
			rent : 0,
			rent_increment : 0,
			description : 'You have found a manhole cover under which the sewer is less pungent than usual. You rest there.'
		},
		2 : {
			name : 'the Dried Stain Motel',
			rent : 40,
			rent_increment : 1,
			description : 'The sheets are already soaked with bodily fluids. What\'s a little more?'
		},
		3 : {
			name : 'the Personal Rat Apartments',
			rent : 900,
			rent_increment : 30,
			description : 'Don\'t let the name fool you. You share many rats with your neighbors.'
		},
		4 : {
			name : 'the Medium Roach Flats',
			rent : 1100,
			rent_increment : 30,
			description : 'You are unsure if the roaches are better than the rats; There are more of them, but they are smaller.'
		},
		5 : {
			name : 'the Pest-Free Townhomes',
			rent : 1500,
			rent_increment : 30,
			description : 'Landlords, it seems, do not consider themselves pests.'
		},
		6 : {
			name : 'a rickety tool shed',
			rent : 1300,
			rent_increment : 0,
			description : 'You wrap yourself in a tarp, in case sunlight seeps in through a missing wall slat.'
		},
		7 : {
			name : 'a double-wide trailer',
			rent : 13000,
			rent_increment : 365,
			description : 'You worry sometimes that a neighbor\'s meth lab explosion might leave you exposed to the sun.'
		}/*,
		 : {
			name : '',
			rent : ,
			rent_increment : ,
			description : ''
		}*/
	}
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
	message(vamp_object.hunt_encounters[rand2][rand]);
	if (rand2 == 1 && rand == 5) {
		vamp_object.energy += 1;
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
	
	if (!vamp_object.energy_upgrade_flag && vamp_object.blood >= vamp_object.energy_upgrade_cost) {
		vamp_object.energy_upgrade_flag = true;
		var energy_upgrade_butt = document.createElement('button');
		energy_upgrade_butt.id = 'energy_upgrade_butt';
		energy_upgrade_butt.innerHTML = 'Infuse Muscles With Blood: ' + vamp_object.energy_upgrade_cost + ' blood';
		document.getElementById('mechanics_upgrades').appendChild(energy_upgrade_butt);
		energy_upgrade_butt.addEventListener('click', function() {energy_upgrade()}, false);
	}
	
	rand = Math.floor(Math.random() * 101);
	if (vamp_object.flavor_events[rand]) message(vamp_object.flavor_events[rand]);
	
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
		message('You have not learned quite enough, yet');
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
	vamp_object.energy_upgrade_cost = Math.floor(1.1 * vamp_object.energy_upgrade_cost) + 10; // Raise cost incrementally
	document.getElementById('blood').innerHTML = vamp_object.blood;
	document.getElementById('energy').innerHTML = vamp_object.energy;
	document.getElementById('energy_max').innerHTML = vamp_object.energy_max;
	document.getElementById('energy_upgrade_butt').innerHTML = 'Infuse Muscles With Blood: ' + vamp_object.energy_upgrade_cost + ' blood';
	message('You suffuse your muscles with the power of the Blood, and they swell with vigor. ');
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


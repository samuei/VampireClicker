window.onload = function() {
	// Listeners
	document.getElementById("hunt").addEventListener('click', function() {vamp_object.hunt()}, false);
	document.getElementById("save").addEventListener('click', function() {vamp_object.save()}, false);
	document.getElementById("delete_save").addEventListener('click', function() {vamp_object.delete_save()}, false);
	
	// Check for localStorage
	if (typeof(Storage) !== "undefined") {
		if(localStorage.blood) {
			// Making the quick and dirty assumption that if there is any saved data, all data was saved.
			// I recognize the danger in this.
			vamp_object.blood = parseInt(localStorage.blood, 10);
			vamp_object.energy = parseInt(localStorage.energy, 10);
			vamp_object.experience = parseInt(localStorage.experience, 10);
			vamp_object.night = parseInt(localStorage.night, 10);
			vamp_object.money = parseInt(localStorage.money, 10);
			vamp_object.money_flag = parseInt(localStorage.money_flag, 10);
			document.getElementById("night").innerHTML = vamp_object.night;
			document.getElementById("blood").innerHTML = vamp_object.blood;
			document.getElementById("energy").innerHTML = vamp_object.energy;
			document.getElementById("money").innerHTML = vamp_object.money;
			if (vamp_object.money_flag) {
				document.getElementById("money_outer").style.display = 'inline';
				document.getElementById('mechanics_upgrades').style.display = 'block';
			}
			else if (vamp_object.experience >= 10) {
				var loot_unlock_butt = document.createElement('button');
				loot_unlock_butt.id = 'loot_unlock_butt';
				loot_unlock_butt.innerHTML = 'Loot victims: 10 xp';
				document.getElementById('mechanics_upgrades').appendChild(loot_unlock_butt);
				loot_unlock_butt.addEventListener('click', function() {vamp_object.loot_unlock()}, false);
				document.getElementById('mechanics_upgrades').style.display = 'block';
			}
			vamp_object.message(localStorage.buffer);
			vamp_object.message('Loaded from localStorage'); // Not the other way around, because then you'd never see this
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
	// Bookkeeping variables
	blood : 1,
	energy : 1,
	experience : 0,
	money : 0,
	night : 1,
	buffer : "You are a blood-sucking creature of the night.<br>" +
		"<br>You require the blood of the living to animate your soulless corpse every sunset." + 
		"<br>Perhaps as you grow and learn about the night, you will become able to do more than simply feed and sleep. " + 
		"<br>Perhaps. Or perhaps not. ",
	
	// Flags
	money_flag : 0,
	
	// Actions
	// Spend one energy hunting for food
	hunt : function() {
		// Update object values
		this.blood += 1;
		this.energy -= 1;
		this.experience += 1;
		// Update HTML values
		document.getElementById("blood").innerHTML = this.blood;
		document.getElementById("energy").innerHTML = this.energy;
		document.getElementById("experience").innerHTML = this.experience;
		
		// Feeding message
		var rand = Math.floor(Math.random() * 9),
			rand2 = Math.floor(Math.random() * (this.money_flag + 1));
		this.message(this.hunt_encounters[rand2][rand]);
		
		// Money, if applicable
		rand = Math.floor(Math.random() * 9);
		var money_gained = (rand * this.money_flag)
		this.money += money_gained;
		document.getElementById("money").innerHTML = this.money;
		if (money_gained) this.message('You abscond with $'+money_gained);
		
		// Speaking of the applicability of money...
		if (this.money_flag == 0 && this.experience == 10) {
			var loot_unlock_butt = document.createElement('button');
			loot_unlock_butt.id = 'loot_unlock_butt';
			loot_unlock_butt.innerHTML = 'Loot victims: 10 xp';
			document.getElementById('mechanics_upgrades').appendChild(loot_unlock_butt);
			loot_unlock_butt.addEventListener('click', function() {vamp_object.loot_unlock()}, false);
			document.getElementById('mechanics_upgrades').style.display = 'block';
		}
		
		rand = Math.floor(Math.random() * 101);
		if (this.flavor_events[rand]) this.message(this.flavor_events[rand]);
		
		// Energy check
		if (this.energy <= 0) {
			this.end_night();
		}
		
	},
	
	// End the night
	end_night : function() {
		// Update object values
		this.night += 1;
		this.blood -= 1;
		this.energy += Math.abs(this.energy) + 1; // Reset energy. I thought it was a clever solution.
		// Update HTML values
		document.getElementById("night").innerHTML = this.night;
		document.getElementById("blood").innerHTML = this.blood;
		document.getElementById("energy").innerHTML = this.energy;
		
		this.message("You slink back to your nest before dawn.");
		
		// Death check
		if (this.blood <= 0) { 
			this.message("<br>You have failed to acquire enough blood to survive the day.<br>" + 
				"Your corpse does not rise at dusk.<br><br>" + 
				"The End.<br>");
			document.getElementById("hunt").style.display = 'none';
			return;
		}
	},
	
	loot_unlock : function() {
		if (this.experience < 10) { // How u do dis?
			this.message('You have not learned quite enough, yet');
			return;
		}
		document.getElementById('loot_unlock_butt').style.display = 'none';
		this.money_flag = 1;
		document.getElementById("money_outer").style.display = 'inline';
		this.experience-= 10;
		document.getElementById("experience").innerHTML = this.experience;
		this.message('Memories of life trickle in with the blood, and you remember...money');
	},
	
	// Update buffer with new text
	message : function(in_text) {
		// Join the buffer with the new text
		var split_buffer = this.buffer.split('<br>').concat(in_text.split('<br>'));
		// Only want the last 10 lines
		if (split_buffer.length > 10) {
			split_buffer = split_buffer.slice(-10);
		}
		// Rejoin and update buffer
		this.buffer = split_buffer.join('<br>');
		document.getElementById("center_panel").innerHTML = this.buffer;
	},
	
	// Save to localStorage
	save : function() {
		localStorage.blood = vamp_object.blood;
		localStorage.energy = vamp_object.energy;
		localStorage.experience = vamp_object.experience;
		localStorage.night = vamp_object.night;
		localStorage.money = vamp_object.money;
		localStorage.money_flag = vamp_object.money_flag;
		localStorage.buffer = vamp_object.buffer;
	},
	
	// Wipe save from localStorage
	delete_save : function() {
		localStorage.removeItem('blood');
		localStorage.removeItem('energy');
		localStorage.removeItem('experience');
		localStorage.removeItem('night');
		localStorage.removeItem('money');
		localStorage.removeItem('money_flag');
		localStorage.removeItem('buffer');
		this.message('Your local save has been wiped clean.');
	},
	
	// Text storage
	flavor_events : {
		1 : 'A truck labeled "Demeter Shipping" nearly runs you over.',
		2 : 'Somewhere, a car alarm blares.',
		3 : 'You hear a woman scream in the distance.',
		4 : 'You pass by a man crying at a bus stop.',
		5 : 'You hear a woman scream in the distance.',
		6 : 'You could swear you heard a music box, but when you stop to listen, there is nothing.',
		7 : 'A sinister fog rolls over the city.',
		8 : 'A sinister fog rolls over the city.',
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
	}
};
window.onload = function() {
	// Listeners
	document.getElementById("hunt").addEventListener('click', function() {vamp_object.hunt()}, false);
};

// Primary game object
var vamp_object = {
	blood : 1,
	energy : 1,
	experience : 0,
	night : 1,
	buffer : "You are a blood-sucking creature of the night.<br>" +
		"<br>You require the blood of the living to animate your soulless corpse every sunset." + 
		"<br>Perhaps as you grow and learn about the night, you will become able to do more than simply feed and sleep. " + 
		"<br>Perhaps. Or perhaps not. ",
	
	hunt : function() {
		this.blood += 1;
		this.energy -= 1;
		this.experience += 1;
		document.getElementById("blood").innerHTML = this.blood;
		document.getElementById("energy").innerHTML = this.energy;
		document.getElementById("experience").innerHTML = this.experience;
		
		
		if (this.energy <= 0) {
			this.night += 1;
			this.blood -= 1;
			this.energy += Math.abs(this.energy) + 1;
			document.getElementById("night").innerHTML = this.night;
			document.getElementById("blood").innerHTML = this.blood;
			document.getElementById("energy").innerHTML = this.energy;
			debugger;
			if (this.blood <= 0) { 
				this.message("<br>You have failed to acquire enough blood to survive the day.<br>" + 
					"Your corpse does not rise at dusk.<br><br>" + 
					"The End.<br>");
				document.getElementById("hunt").style.display = 'none';
				return;
			}
			
			this.message("You corner a hobo and take your fill.");
		}
	},
	
	message : function(in_text) {
		// Join the buffer with the new text
		var split_buffer = this.buffer.split('<br>').concat(in_text.split('<br>'));
		// Only want the last 8 lines
		if (split_buffer.length > 8) {
			split_buffer = split_buffer.slice(-8);
		}
		this.buffer = split_buffer.join('<br>');
		document.getElementById("center_panel").innerHTML = this.buffer;
	}
};
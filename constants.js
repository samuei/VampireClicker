// special vals: money_flag, energy_upgrade_flag, buffer
export const vamp_load_vals = [
	'blood', 
	'energy', 
	'energy_max', 
	'experience', 
	'night', 
	'money', 
	'energy_upgrade_cost'
];

export const flavor_events = [
	'A truck labeled "Demeter Shipping" nearly runs you over.',
	'Somewhere, a car alarm blares.',
	'You hear a woman scream in the distance.',
	'You pass by a man crying at a bus stop.',
	'You aren\'t sure if that\'s fog or evaporated sewage, and you don\'t want to know.',
	'You could swear you heard a music box, but when you stop to listen, there is nothing.',
	'A sinister fog rolls over the city.',
	'It seems like there are more rats than usual, but how could you tell?',
	'You feel as if you\'re being watched.',
	'A bat flies overhead.',
	'A wolf howls somewhere, sending a shiver down your spine'
];

export const hunt_encounters = [
	[
		{
			message: 'The prostitute\'s blood is sour, and it feels gummy in your veins.'
		},
		{
			message: 'You corner a homeless man and take your fill.'
		},
		{
			message: 'You find a junkie and drink from her during a stupor. You feel dizzy and a little confused.'
		},
		{
			message: 'You meet a goth woman who opens a vein for you willingly.'
		},
		{
			message: 'An old lady is walking her cat. Neither one offers up much resistance.'
		},
		{
			message: 'A teenager is closing up a drive-thru, and his dead eyes don\'t notice you. His blood is almost lifeless.'
		},
		{
			message: 'A drunk falls face-first into the bush you\'re prowling through. It must be fate.'
		},
		{
			message: 'You find a teenage boy slipping home from his girlfriend\'s bedroom. Call it a happy meal.'
		},
		{
			message: 'The amateur astronomer is too busy with her telescope to notice your approach.'
		}
	],
	[
		{
			message: 'Willie-Joe didn\'t have much in the cab of his truck, but he had plenty of blood in his veins.'
		},
		{
			message: 'You come upon a man playing an accordian for street change. You take his blood, take his change, and break his accordian.'
		},
		{
			message: 'You are mugged by a man you affectionately come to know as "Dinner."'
		},
		{
			message: 'You find yourself on a college campus. The professor\'s blood is not as dry as his lectures.'
		},
		{
			message: 'A policewoman walks right next to the bush you are feeding in. You should be more careful.'
		},
		{
			message: 'The hipster\'s blood comes with a free venti soy no-foam half-caf vanilla latte with vegan caramel drizzle. Score!',
			energy_add: 1
		},
		{
			message: 'You encounter a LARPer, separated from his group. His healing potions turn out to be jello shots. Huh.'
		},
		{
			message: 'A local community theater is doing a Carmilla stage show. You give the actress in the title role a realistic pallor.'
		},
		{
			message: 'You don\'t want to sound cliche, but if the street-corner fortune teller didn\'t see this coming, it was her own fault.'
		}
	]
];

export const nests = [
	{
		name : 'wherever you can find',
		rent : 0, // Free!
		rent_increment : 0, // Rent is only charged on first purchase
		description : 'Whether in a dumpster or a long culvert, you simply crawl into a safe-looking spot near the dawn.'
	},
	{
		name : 'the Sewer',
		rent : 0,
		rent_increment : 0,
		description : 'You have found a manhole cover under which the sewer is less pungent than usual. You rest there.'
	},
	{
		name : 'the Dried Stain Motel',
		rent : 40, // 40 bucks
		rent_increment : 1, // Per night
		description : 'The sheets are already soaked with bodily fluids. What\'s a little more?'
	},
	{
		name : 'the Personal Rat Apartments',
		rent : 900,
		rent_increment : 30, // Per month
		description : 'Don\'t let the name fool you. You share many rats with your neighbors.'
	},
	{
		name : 'the Medium Roach Flats',
		rent : 1100,
		rent_increment : 30,
		description : 'You are unsure if the roaches are better than the rats; There are more of them, but they are smaller.'
	},
	{
		name : 'the Pest-Free Townhomes',
		rent : 1500,
		rent_increment : 30,
		description : 'Landlords, it seems, do not consider themselves pests.'
	},
	{
		name : 'a rickety tool shed',
		rent : 1300,
		rent_increment : 0,
		description : 'You wrap yourself in a tarp, in case sunlight seeps in through a missing wall slat.'
	},
	{
		name : 'a double-wide trailer',
		rent : 13000,
		rent_increment : 365, // Per year
		description : 'You worry sometimes that a neighbor\'s meth lab explosion might leave you exposed to the sun.'
	},
	{
		name : 'a pre-fab house in a passable neighborhood',
		rent : 145000,
		rent_increment : 0,
		description : 'Thankfully, the HOA does not seem to recognize a new bloodsucker on its turf.'
	},
	{
		name : 'a McMansion',
		rent : 850000,
		rent_increment : 0,
		description : 'Dormers. Dormers everywhere.'
	},
	{
		name : 'a Stately Manor',
		rent : 1550000,
		rent_increment : 0,
		description : 'It has a tasteful, understated quality, manageable ivy coverage, and plenty of basement space for bodies.'
	},
	{
		name : 'a Palatial Villa',
		rent : 3750000,
		rent_increment : 0,
		description : 'With gates, wading pools, a stable, and servant\'s quarters, you suspect this might have once been a plantation.'
	},
	{
		name : 'an Actual Castle',
		rent : 10000000,
		rent_increment : 0,
		description : 'You\'ve made it!'
	}
];
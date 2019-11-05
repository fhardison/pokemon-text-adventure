function getbadge(disk, room, println) {
  const badge = room.items.find(item => item.name.includes("badge"));
  if (badge){
    badge.isTakeable = true;
    disk.inventory.push(badge);
    println("You got the ".concat(badge.name));
  }
}

function giveUpItem(items, itemname){
  return items.filter(function(value, index, arr){
  value.name !== itemname
});
}

function hasItem(itemlist, itemName){
  for (var i = 0; i < itemlist.length;i++){
    if (itemlist[i].name === itemName){
      return true;
    }
  }
  return false;
}

function doPokemon(disk, println, getRoom, pokemonName, pokemonAttack, beats, weakto, goto) {
  const room = getRoom(disk.roomId);
  const pokemon = room.items.find(item =>  item.type.includes('pokemon'));
  if (pokemon) {
    if (pokemon.battle) {
      if (pokemon.poketype === beats) {
        println(pokemonName.concat(" used ", pokemonAttack, " and knoked out the pokemon!"));
        getbadge(disk, room, println);
        goto(pokemon.battleover);
      } else if (weakto === pokemon.poketype) {
        println(pokemonName.concat(" is weak to ", pokemon.poketype, " types. Try again with a different pokemon."))
        goto(pokemon.battleover);
      } else {
        println(pokemonName.concat(" battles ", pokemon.name, " but neither wins. It's a tie. Try a different pokemon."))
        goto(pokemon.battleover);
      }
    } else {
      pokemon.isTakeable = true;
      println(pokemonName.concat(" used ", pokemonAttack, " and knoked out the other pokemon!", " ", "Try using a pokeball!"));
    }
  } else {
    println(pokemonName.concat(" is smiling."));
  }

}

const ratata = { name: "ratata", isTakeable: false, desc: "It's a ground type pokemon that likes to live in tall grass.", type: 'pokemon' };
const ratata = { name: "diglet", isTakeable: false, desc: "It's a ground type pokemon that likes to live underground.", type: 'pokemon' };
const unlimitedAdventure = {
  roomId: 'gamestart',
  inventory: [],
  rooms: [
    {
      name: 'Pokemon Center',
      id: 'gamestart',
      nobattle: true,
      img: ``,
      desc: `
        You are in a Pokemon research center.
        There are three Pokemon you can pick from: A Pikachu, a Charmander, and a Bulbasaur.
        [take] one!
        Don't forget to [take] a pokeball or two.
        You can go [out] the exit door.
      `,
      items: [
        { name: 'pikachu', isTakeable: true, type: 'pokemon', desc: 'It\'s an electric type Pokemon.', use: ({disk, println, getRoom, enterRoom}) => {
          doPokemon(disk, println, getRoom, "Pikachu", "Thunderbolt", 'fire', 'rock', enterRoom);
        }},
        { name: 'charmander', isTakeable: true, type: 'pokemon',  desc: 'It\'s a fire type Pokemon.', use: ({disk, println, getRoom, enterRoom}) => {
          doPokemon(disk, println, getRoom, "Charmander", 'Flamethrower', 'grass', 'water', enterRoom);
        }},
        { name: 'bulbasaur', isTakeable: true, type: 'pokemon', desc: 'It\'s a grass type Pokemon.', use: ({disk, println, getRoom, enterRoom}) => {
          doPokemon(disk, println, getRoom, "Bulbasaur", "Vine Whip", 'rock', 'fire', enterRoom);
        } },
        { name: 'pokeball', isTakeable: true, desc: "It\'s a PokeBall.", use: ({disk, println, getRoom}) => {
          const room = getRoom(disk.roomId);
          const pokemon = room.items.find(item =>  item.type.includes('pokemon'));
          if (pokemon) {
            if (pokemon.isTakeable) {
              println("You threw a pokeball and caught the pokemon!");
              disk.inventory.push(pokemon);
              room.items = room.items.filter(function(value, index, arr){
              value.name !== pokemon.name
            });
            } else {
            println("The pokemon escaped. Try using one of your pokemon.");
            }
          } else {
            println("There is nothing to use the PokeBall on");
          }
        }},
        {name: "flashlight", isTakeable: true, desc: 'it\'s a flashlight. It shines on things'},
      ],
      exits: [
        { dir: 'out', id: 'pallettown' },
      ]
    },
    {
      name: 'Pallet Town',
      id: 'pallettown',
      img: ``,
      desc: `You are outside of the Pokemon research center. You see a road to the [west] and a the research center is [north] of you. Oh and your [house].`,
      exits: [
        { dir: 'north', id: 'gamestart'},
        { dir: 'west', id:'roadtobrock'},
        { dir: 'n', id: 'gamestart'},
        { dir: 'w', id:'roadtobrock'},
        { dir: 'house', id: 'yourhouse'},
      ]
    },
    {
      name: 'Your house',
      id: 'yourhouse',
      desc: "It's your house. Your mom is cooking by the stove. You feel happy here.",
      exits: [
        { dir: 'out', id: 'pallettown' },
      ],
    },
    {
      name: 'Road to Pewter City',
      id: 'roadtobrock',
      img: `
      Pewter City
          |
          |
          |
          |
      Pallet Town`,
      desc: `
        You're on the road to Pewter City.
        You see a wild Ratata in the tall grass.
        You can go south to go back to Pallet Town or north to go to Pewter City.
      `,
      items: [
        ratata,
      ],
      exits: [
        { dir: 'north', id: 'pewtercity'},
        { dir: 'south', id:'pallettown'},
        { dir: 'n', id: 'pewtercity'},
        { dir: 's', id:'pallettown'}
      ],
    },
    {
      name: 'Pewter City',
      id: "pewtercity",
      img: ``,
      desc: `
      You are in Pewter City. There is a Pokemon [center], a [gym], and a [museam].
      Where do you want to go?
      `,
      exits: [
        { dir: 'gym', id:'pewtergym'},
        { dir: 'center', id:'pewterpokemoncenter'},
        { dir: 'museam', id:'pewtermuseam'},
        { dir: 'west', id: 'rocktunnel'},
        { dir: 'home', id : 'gamestart'},
      ],
    },
    {
      name: "Pewter City Gym",
      id: 'pewtergym',
      img: `Gym`,
      desc: `You you are in the gym. Do you want to go [battle] the gym leader?
      You can go [out] the exit.`,
      exits: [
        {dir : 'out', id:'pewtercity'},
        {dir: 'battle', id: 'pewtergymbattle'},
        { dir: 'home', id : 'gamestart'},
      ],
    },
    {
      name: "Pewter City Gym Battle",
      id: 'pewtergymbattle',
      img: ``,
      desc: `You are battling Brock. He has an Onix.
      You can [leave] the battle.`,
      items: [
        { name: "onix", isTakeable: false, battle: true, poketype: 'rock', battleover: "pewtergym", desc: "It's a rock type pokemon that likes to live underground.", type: 'pokemon' },
        { name: "rockbadge", isTakeable: false,  desc: "It's the Rock Badge from Brock. Go to the Rock tunnle or Diglet's cave to find more rock types to catch.", type: 'bagde' },
      ],
      exits: [
        {dir : 'leave', id:'pewtergym'},
        { dir: 'home', id : 'gamestart'},
      ],
    },
    {
      name: "Pewter City Pokemon Center",
      id: 'pewterpokemoncenter',
      img: ``,
      desc: `
      You are in the Pokemon center.
      There is a scientist working there. He seems to like fossels.
      You can go [out] the exit.`,
      exits: [
        {dir : 'out', id:'pewtercity'},
        { dir: 'home', id : 'gamestart'},
      ],
    },
    {
      name: "Pewter City Museam",
      id: 'pewtermuseam',
      img: ``,
      desc: `You are in the Pokemon Museam. There are lots of pokemon fossels here!
      There's some old amber here.
      You can go [out] the exit.`,
      items: [
        {name: "old-amber", desc: "It's an ancient fossel", isTakeable: true, use: ({disk, println, getRoom}) => {
          const room = getRoom(disk.roomId);
          if (room.id === "pewterpokemoncenter"){
            println("You gave your fossel to the Pokemon center worker and they put it into a special machine. You got a Aerodactyl.");
            disk.inventory.push({ name: "aerodactyl", isTakeable: true, poketype: 'rock', desc: "It's a rock and flying type pokemon that came from old amber.", type: 'pokemon' });

          }
        }},
      ],
      exits: [
        { dir : 'out', id:'pewtercity'},
        { dir: 'home', id : 'gamestart'},
      ],
    },
    {
      name: "Rock Tunnel",
      id: 'rocktunnel',
      desc: ``,
      img: '',
      restriction: true,
      canEnter: ({disk, println, getRoom, enterRoom}) => {
        if (hasItem(disk.inventory, "flashlight")){
          return true;
        }
        return false;
      },
      exits: [
        { dir : 'out', id:'pewtercity'},
      ],
    },
  ],
};

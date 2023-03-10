// Need to install Node.js
// To run code. Type node reply.js in terminal

// Strategy
// Create an array of arrays containing the demons info. e.g. [[16 4 18 13 0 10 5 0 0 7 4 1 1 6 10 2 9], ...[...]]
// Find demons whose required stamina is less than or equal to player's stamina
// Find that set of demons find the demon the highest recovered stamina
// Use an array to keep track of the demons left
// Use an array to keep track of stamina recovered from each demon
// Use an array to keep track of turn to recover stamina (ith turn + no. of turns to recover stamina) from each demon

file_name = "00-example.txt";
// file_name = "01-the-cloud-abyss.txt";
// file_name = "02-iot-island-of-terror.txt";
// file_name = "03-etheryum.txt";
// file_name = "04-the-desert-of-autonomous-machines.txt";
// file_name = "05-androids-armageddon.txt";

const fs = require("fs");
let input_raw = "";

// Read in raw text
try {
  input_raw = fs.readFileSync(file_name, "utf8");
} catch (err) {
  console.error(err);
}

input_raw = input_raw.split("\n");

let input_arr = [];
let input_row = "";

// Convert string to array of characters
for (let i = 0; i < input_raw.length; i++) {
  input_row = input_raw[i].split(" ");
  input_arr.push(input_row);
}

// Convert characters to numbers
for (let i = 0; i < input_arr.length; i++) {
  for (let j = 0; j < input_arr[i].length; j++) {
    input_arr[i][j] = parseInt(input_arr[i][j], 10);
  }
}

let player_stamina = input_arr[0][0];
const player_max_stamina = input_arr[0][1];
const turns_available = input_arr[0][2];
const demons_available = input_arr[0][3];

// Create demons matrix
let demons = [];
for (let i = 0; i < demons_available; i++) {
  demons.push(input_arr[1 + i]);
}

// Find attackable demons;
const findAttackableDemons = (player_stamina, demonsIdx) => {
  let attackable_demons = [];
  for (let i = 0; i < demonsIdx.length; i++) {
    let stamina_needed = demons[demonsIdx[i]][0];
    if (player_stamina >= stamina_needed) {
      attackable_demons.push(demonsIdx[i]);
    }
  }
  return attackable_demons;
};

// Find demon with most stamina recovered
const findDemonMostStaminaRec = (demonsIdx) => {
  let stamina_rec = -1;
  let demon_most_stamina_rec = 0;
  for (let i = 0; i < demonsIdx.length; i++) {
    if (demons[demonsIdx[i]][2] > stamina_rec) {
      stamina_rec = demons[demonsIdx[i]][2];
      demon_most_stamina_rec = demonsIdx[i];
    }
  }
  return demon_most_stamina_rec;
};

let output = [];
let attackable_demons = [];
let selected_demon = 0;
let stamina_recovered = 0;
let add_stamina_turn = 0;
// Keep track of demons left
let demons_left = [];
for (let i = 0; i < demons_available; i++) {
  demons_left.push(i);
}
let stamina_rec = [];
let turn_rec = [];
for (let i = 0; i < turns_available; i++) {
  if (stamina_rec.length > 0) {
    for (let j = 0; j < stamina_rec.length; j++) {
      if (turn_rec[j] === i) {
        player_stamina += stamina_rec[j];
        if (player_stamina > player_max_stamina) {
          player_stamina = player_max_stamina;
        }
      }
    }
  }

  attackable_demons = findAttackableDemons(player_stamina, demons_left);
  if (attackable_demons.length > 0) {
    selected_demon = findDemonMostStaminaRec(attackable_demons);
    player_stamina -= demons[selected_demon][0];
    stamina_recovered = demons[selected_demon][2];
    stamina_rec.push(stamina_recovered);
    add_stamina_turn = demons[selected_demon][1] + i;
    turn_rec.push(add_stamina_turn);
    output.push(selected_demon);
    demons_left.splice(demons_left.indexOf(selected_demon), 1);
  }
}

console.log(output);

const content = output.join("\n");
// Write to text file -Name of file "result.txt"
try {
  fs.writeFileSync("result.txt", content);
  // file written successfully
} catch (err) {
  console.error(err);
}

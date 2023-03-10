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
let demons = new Map();
let output = [];
let frag_collected = [];

// Get demon information
for (let i = 0; i < demons_available; i++) {
  demons.set(i, input_arr[i + 1]);
}

//Calculate fragments earned
// const calcFragEarned = (demonIdx, fragment_turns) => {
//   let sum = 0;
//   for (let i = 0; i < fragment_turns && i < turns_available; i++) {
//     sum += demons[demonIdx][4 + i];
//   }
//   return sum;
// };

let turn_to_add_stamina = [];
let demons_defeated = [];

for (let i = 0; i < turns_available; i++) {
  let attackable_demons = [];
  let max_stamina_recovered = -1;
  let max_stamina_recovered_idx = 0;

  for (let x = 0; x < output.length; x++) {
    for (let j = 0; j < turn_to_add_stamina.length; j++) {
      if (i === turn_to_add_stamina[j]) {
        console.log(output[x]);
        player_stamina += demons.get(output[x])[2];
        if (player_stamina > player_max_stamina) {
          player_stamina = player_max_stamina;
        }
      }
    }
  }
  console.log("player stamina", player_stamina);

  // Find attackable demons
  demons.forEach((value, key) => {
    if (!output.includes(key)) {
      let stamina_needed = value[0];
      if (stamina_needed <= player_stamina) {
        attackable_demons.push(key);
      }
    }
  });
  console.log("attackable demons", attackable_demons);

  // Find demon with highest stamina recovered
  for (let k = 0; k < attackable_demons.length; k++) {
    let stamina_recovered = demons.get(attackable_demons[k])[2];
    if (stamina_recovered > max_stamina_recovered) {
      max_stamina_recovered = stamina_recovered;
      max_stamina_recovered_idx = attackable_demons[k];
    }
  }
  console.log("max_stam_rec_idx", max_stamina_recovered_idx);

  // Player can attack
  if (
    attackable_demons.length > 1 &&
    !output.includes(max_stamina_recovered_idx)
  ) {
    // Attack demon. Subtract stamina points
    let demon_stamina = demons.get(max_stamina_recovered_idx)[0];
    player_stamina -= demon_stamina;
    turn_to_add_stamina.push(i + demons.get(max_stamina_recovered_idx)[1]);
    output.push(max_stamina_recovered_idx);
  }
}
console.log(turn_to_add_stamina);
console.log("output", output);

// for (let i = 0; i < turns_available; i++) {
//   // Check fragments earned
//   for (let j = 0; j < demons.length; j++) {
//     let stamina_needed = demons[j][0];
//     let turns_recover_stamina = demons[j][1];
//     let stamina_recovered = demons[j][2];
//     let fragment_turns = demons[j][3];
//     if (stamina_needed <= player_stamina) {
//       let sum = 0;
//       let max = -1;
//       for (let k = 0; k < fragment_turns && k < turns_available; k++) {
//         sum += demons[j][3 + k];
//       }
//       if (sum > max) {
//         max = sum;
//         ind = j;
//       }
//     }
//   }
// }

// output.push(ind);
// console.log(output);

const content = demons.toString();

// Write to text file
try {
  fs.writeFileSync("test.txt", content);
  // file written successfully
} catch (err) {
  console.error(err);
}

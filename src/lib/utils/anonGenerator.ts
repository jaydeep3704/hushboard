const adjectives = [
  "Fierce",
  "Silent",
  "Swift",
  "Mighty",
  "Brave",
  "Cunning",
  "Wild",
  "Sneaky",
  "Crimson",
  "Shadow",
  "Jolly",
  "Witty",
  "Grumpy",
  "Cheesy",
  "Bouncy",
  "Zany",
  "Funky",
  "Sleepy",
  "Nimble",
  "Quirky"
];

const nouns = [
  "Tiger",
  "Wolf",
  "Falcon",
  "Panther",
  "Viper",
  "Hawk",
  "Fox",
  "Lion",
  "Raven",
  "Cobra",
  "Penguin",
  "Donkey",
  "Banana",
  "Pancake",
  "Taco",
  "Sloth",
  "Otter",
  "Llama",
  "Pickle",
  "Unicorn"
];


export function generateAnonName(){
    let noun=nouns[Math.floor(Math.random()*nouns.length)]
    let adjective=adjectives[Math.floor(Math.random()*adjectives.length)]
    let number=1000+Math.floor(Math.random()*9000)
    return `${adjective}${noun}#${number}`
}


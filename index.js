const token = "your token here"; //Token to log the bot in. DO NOT SHARE.
const keep_alive = require('./keep_alive.js'); //Server to keep bot on 24/7.

//Installing dependencies--------------------------------------
let Discord = null;
let fs = null;
let path = null;
try {
  Discord = require('discord.js'); //Importing Discord.js (Discord API wrapper for NodeJS).
  fs = require('fs'); //fs is NodeJS's native file handling depedency.
  path = require('path'); //Unneeded library idk why i have it i think i forgot to delete it (i copied this file from another bot).
} catch(e) {
  console.log("Unable to install some dependencies. Attempted to install:\nDiscord.js\nfs\npath.\nError:\n" + e);
}
//Constants------------------------------------------------------------
const client = new Discord.Client(); //Making a new Discord client (instance).
const version = "v1.0"; //Version number i use for the footers of embeds.
const colour = '#0099ff'; //Colour of embeds.
const footer = "bot name here " + version + " | developer here"; //Generic footer i use for most bots.

const data = JSON.parse(fs.readFileSync("./JSONs/general.json", "utf8")); //general.json is the JSON where the prefix for the bot is held.
let prefix = data["prefix"]; //Getting the prefix key from the data.

client.commands = new Discord.Collection(); //Making a new collection to store commands in.
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')); //Getting all files in "commands" folder that are JS files.

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.name, command); //Adding files to collection.
}

client.on("ready" => { //Triggers when bot is starting.
    console.log("Bot online");
});

//On message sent event ------------------------------------------
client.on('message', msg => { //This event will trigger when any member of any guild (server) sends a message in any channel that the bot has access to.
  msg.content = msg.content.toLowerCase(); //Parsing the message (msg) to all lower case, cuz it's easier.
  if (!msg.content.startsWith(prefix) || msg.author.bot) return; //if the message does not start with the prefix (line 22), then do nothing and return.
  //Creating command arguments
	const args = msg.content.slice(prefix.length).trim().split(/ +/); //Getting arguments in an array. Done by removing prefix + command, ex: "!say hi hru" --> args = ["hi", "hru"];
  const command = args.shift().toLowerCase(); //getting the command (in the example above the command is "say").
  

  if(command === "help") { //Checking if command == "help"
    client.commands.get('help').execute(msg, args, prefix); //Executing the help.js file.
  }
/*
  add a new command by:
  if(command === "xyz") {
    client.commands.get("xyz").execute(msg, args);
  }
  Note: you'd first have to make the xyz.js file in the "commands" folder.
  */
});

//Embed function for general use. This embed can be used for most situations unless you want to add a picture, or fields.
function typicalEmbed(desc, title, footer, colour) {
  const Embed = new Discord.MessageEmbed()
  .setColor(colour)
  .setTitle(title)
  .setDescription(desc)
  .setTimestamp()
  .setFooter(footer);

  return Embed;
}

client.login(token); //Logging the bot in with the token on Line 1. 

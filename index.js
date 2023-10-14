const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, Events, GatewayIntentBits, ActivityType } = require("discord.js");
const token = process.env.token;
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

client.once(Events.ClientReady, () => {
  console.log("Ready!");
  if (!fs.existsSync(`./serveur`)) {
    fs.mkdirSync(`./serveur`)
  }
  client.user.setPresence({ activities: { name: "seeks its element", type: ActivityType.Listening, }, status: "online" })
});

client.on(Events.InteractionCreate, async (interaction) => {
  // if (interaction.user.id != '1040602247194738708') {
  //   interaction.reply({ content: `sorry ${interaction.user} you couldn't do that`, ephemeral: true })
  //   return
  // }
  if (!interaction.isChatInputCommand()) return;
  if (!interaction.commandName == "setup") {
    if (!existsSync(`./serveur/${interaction.guildId}`)) return
  }
  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});
const pathmodal = path.join(__dirname, "modal")
const modalFolders = fs.readdirSync(pathmodal);
let modals = {};

modalFolders.forEach((element) => {
  const modalpath = `./modal/${element}`
  const modal = require(modalpath);
  modals[modal.name] = modal;
})

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isModalSubmit()) return;
  modals[interaction.customId].exe(interaction);
});

const pathbutton = path.join(__dirname, "button")
const buttonFolders = fs.readdirSync(pathbutton);
let buttons = {};

buttonFolders.forEach((element) => {
  const bpath = `./button/${element}`
  const button = require(bpath);
  buttons[button.name] = button;
})
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isButton()) return;
  buttons[interaction.customId].exe(interaction);
});
const pathmenu = path.join(__dirname, "menu")
const menuFolders = fs.readdirSync(pathmenu);
let menus = {};

menuFolders.forEach((element) => {
  const mpath = `./menu/${element}`
  const menu = require(mpath);
  menus[menu.name] = menu;
})
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isAnySelectMenu()) return;
  menus[interaction.customId].exe(interaction);
});

client.on(Events.GuildMemberAdd, async interaction => {

})
const pathconmenu = path.join(__dirname, "commands/contextmenu")
const conmenuFolders = fs.readdirSync(pathconmenu);
let conmenus = {};

conmenuFolders.forEach((element) => {
  const cpath = `./commands/contextmenu/${element}`
  const conmenu = require(cpath);
  conmenus[conmenu.name] = conmenu;
})
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isContextMenuCommand()) return;
  conmenus[interaction.customId].execute(interaction);
});
client.login(token);
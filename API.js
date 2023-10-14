
const { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, rmSync, renameSync } = require("fs");
const { ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const path = require("path");

// class GuildApi {
//   channels = {
//     group: ""
//   }
//   id = ""
//   money = {
//     icon: "",
//     name: ""
//   }

//   constructor(guildID) {
//     this.id = guildID;
//     if (!existsSync(`./serveur/${guildID}/guild.json`)) {
//       mkdirSync(`./serveur/${guildID}`);
//     } else {
//       const files = JSON.parse(readFileSync(`./serveur/${guildID}/guild.json`, "utf-8"))
//       this.money = files.money
//       this.channels = files.channels
//     }

//   }
//   write() {
//     const file = {
//       channels: this.channels,
//       money: this.money,
//     };
//     writeFileSync(`./serveur/${this.id}/guild.json`, JSON.stringify(file))
//   }
//   actionAndWrite(action) {
//     action()
//     this.write()
//   }
// }

// class User {
//   inventory = {};
//   guildID = "";
//   id = "";
//   constructor(guildID, userID) {
//     if (!existsSync(`./serveur/${guildID}/users`)) {
//       mkdirSync(`./serveur/${guildID}/users`);
//     }
//     if (existsSync(`./serveur/${guildID}/users/${userID}.json`)) {
//       const file = JSON(readFileSync(`./serveur/${guildID}/users/${userID}.json`, "utf-8"));
//       this.inventory = file.inventory;
//       this.guildID = guildID
//       this.id = file.id
//     }
//   }
//   write() {
//     const file = {
//       id: this.id,
//       inventory: this.inventory,
//     };
//     writeFileSync(`./serveur/${this.guildID}/item/${this.id}.json`, JSON.stringify(file))
//   }
//   actionAndWrite(action) {
//     action()
//     this.write()
//   }
// }
// class item {
//   id = ""
//   name = ""
//   cp = new Number
//   icon = ""
//   guildID = ""
//   constructor(guildID, itemID) {
//     if (!existsSync(`./serveur/${guildID}/item`)) {
//       mkdirSync(`./serveur/${guildID}/item`);
//       this.guildID = guildID;
//     }
//     if (existsSync(`./serveur/${guildID}/item/${itemID}.json`)) {
//       const file = JSON(readFileSync(`./serveur/${guildID}/users/${itemID}.json`, "utf-8"));
//       this.id = file.id;
//       this.name = file.name;
//       this.cp = file.cp;
//       this.icon = file.icon;
//       this.guildID = guildID;
//     }
//   }
//   write() {
//     const file = {
//       id: this.id,
//       name: this.name,
//       cp: this.cp,
//       icon: this.icon
//     };
//     writeFileSync(`./serveur/${this.guildID}/item/${this.id}.json`, JSON.stringify(file))
//   }
//   actionAndWrite(action) {
//     action()
//     this.write()
//   }
// }


//verified
const CancelButton = {
  confirm: new ButtonBuilder().setCustomId('sup').setLabel('delete message').setStyle(ButtonStyle.Danger),
  row: new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('sup').setLabel('delete message').setStyle(ButtonStyle.Danger))
}
const load = new EmbedBuilder().setImage("https://i.imgur.com/pKopwXp.gif");
class GuildApi {
  channels = {
    group: ""
  }
  id = ""
  money = {
    icon: "",
    name: ""
  }
  user(id) { return new user(this.id, id) }
  items() { return new items(this.id) }
  shop() { return new Shop(this.id) }

  constructor(guildID) {
    this.id = guildID
    if (!existsSync(`./serveur/${guildID}`)) {
      mkdirSync(`./serveur/${guildID}`)
      writeFileSync(`./serveur/${guildID}/guild.json`, "{}")
      return
    }
    const files = JSON.parse(readFileSync(`./serveur/${guildID}/guild.json`, "utf-8"))
    this.money = files.money
    this.channels = files.channels
  }
  write() {
    writeFileSync(`./serveur/${this.id}/guild.json`, JSON.stringify(this))
  }
  toJSON() {
    return {
      id: this.id,
      money: this.money,
      channels: this.channels
    }
  }
}
// class money extends Number {
//   isEnough(number){
//     return this - number > 0
//   }
//   remove(number) {
//     this -= number;
//   }
//   set(number) {
//     this = number;
//   }
// }
class user {
  id = ""
  GID = ""
  money = new Number;
  inventory = {}
  constructor(GID, id) {
    if (!existsSync(`./serveur/${GID}/users`)) {
      mkdirSync(`./serveur/${GID}/users`)
    }
    this.GID = GID
    if (existsSync(`./serveur/${GID}/users/${id}.json`)) {
      const file = JSON.parse(readFileSync(`./serveur/${GID}/users/${id}.json`))
      this.inventory = file.inventory
      this.money = file.money
    }
    this.id = id
  }
  delete() {
    if (existsSync(`./serveur/${this.GID}/users/${this.id}.json`)) {
      rmSync(`./serveur/${this.GID}/users/${this.id}.json`)
    }
  }
  toJSON() {
    return {
      id: this.id,
      inventory: this.inventory,
      money: this.money,
    }
  }
  write() {
    writeFileSync(`./serveur/${this.GID}/users/${this.id}.json`, JSON.stringify(this))
  }

}

class items {
  GID = ""
  toArrayPath = []
  toArray = []
  constructor(guildID) {
    this.GID = guildID
    const files = readdirSync(`./serveur/${guildID}/item`);
    files.forEach(element => {
      const itemspath = `./serveur/${guildID}/item/${element}`
      const { id } = JSON.parse(readFileSync(itemspath, "utf-8"))
      this[id] = new Item(itemspath, guildID);
      this.toArrayPath.push(`./serveur/${guildID}/item/${element}`)
      this.toArray.push(id)
    });
  }
  newItem(id, name, icon = undefined, cp = 0) {
    const item = {
      id: id,
      name: name,
      cp: cp,
      icon: icon
    }
    writeFileSync(`./serveur/${this.GID}/item/${id}.json`, JSON.stringify(item))
    this[id] = new Item(`./serveur/${this.GID}/item/${id}.json`, this.GID);
  }
}
class Item {
  id = ""
  name = ""
  cp = new Number
  icon = ""
  GID = ""
  islock() {
    return existsSync(`./serveur/${this.GID}/item/${this.id}.json.lock`)
  }
  constructor(path, GID) {
    this.GID = GID
    const file = JSON.parse(readFileSync(path, "utf-8"))
    this.id = file.id
    this.icon = file.icon
    this.cp = file.cp
    this.name = file.name
  }
  delete() {
    if (existsSync(`./serveur/${this.GID}/item/${this.id}.json`)) {
      rmSync(`./serveur/${this.GID}/item/${this.id}.json`)
    }
  }
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      cp: this.cp,
      icon: this.icon
    }
  }
  write() {
    writeFileSync(`./serveur/${this.id}/item/${this.id}.json`, JSON.stringify(this))
  }
  lock() {
    if (this.islock()) {
      renameSync(`./serveur/${this.GID}/item/${this.id}.json.lock`, `./serveur/${this.GID}/item/${this.id}.json`)
    } else {
      renameSync(`./serveur/${this.GID}/item/${this.id}.json`, `./serveur/${this.GID}/item/${this.id}.json.lock`)
    }
  }
}
class Shop {
  GID = ""
  toArrayPath = []
  toArray = []
  constructor(guildID) {
    this.GID = guildID
    const files = readdirSync(`./serveur/${guildID}/shop`);
    files.forEach(element => {
      const itemspath = `./serveur/${guildID}/shop/${element}`
      const { id } = require(itemspath);
      this[id] = new ItemShop(itemspath, guildID);
      this.toArrayPath.push(`./serveur/${guildID}/shop/${element}`)
      this.toArray.push(id)
    });
  }
  newItem(id, itemId, cost = 0) {
    const item = {
      id: id,
      itemId: itemId,
      cost: cost
    }
    writeFileSync(`./serveur/${this.GID}/shop/${id}.json`, JSON.stringify(item))
    this[id] = new Item(`./serveur/${this.GID}/shop/${id}.json`, this.GID);
  }
}
class ItemShop {
  id = ""
  itemId = ""
  cost = new Number
  GID = ""
  constructor(path, GID) {
    this.GID = GID
    const file = JSON.parse(readFileSync(path))
    this.id = file.id
    this.itemId = file.itemId
    this.cost = file.cost
  }
  delete() {
    if (existsSync(`./serveur/${this.GID}/shop/${this.id}.json`)) {
      rmSync(`./serveur/${this.GID}/shop/${this.id}.json`)
    }
  }
  toJSON() {
    return {
      id: this.id,
      itemId: this.itemId,
      cost: this.cost
    }
  }
  write() {
    writeFileSync(`./serveur/${this.id}/item/${this.id}.json`, JSON.stringify(this))
  }
}
function ifReturn(Boolean, TrueReturn, FalseReturn) {
  if (Boolean) {
    return TrueReturn
  } else {
    return FalseReturn
  }
}
function arrayMutil(array, number) {
  let arrayA = [];
  let arrayResult = [];
  array.forEach((e) => {
    arrayA.push(e);
    if (arrayA.length >= number) {
      arrayResult.push(arrayA);
      arrayA = [];
    }
  })
  if (arrayA.length != 0) {
    arrayResult.push(arrayA)
  }
  return arrayResult
}
class MarketView {
  row;
  embed;
  constructor(interaction, page) {
    const guild = new GuildApi(interaction.guildId);
    const shop = guild.shop()
    const items = guild.items()
    const fielnot = arrayMutil(shop.toArray, 6)
    const fiels = []
    fielnot[page - 1].forEach((e) => {
      const itemshop = shop[e]
      const item = items[itemshop.itemId]
      fiels.push({ name: `${item.icon} : *${item.name}*`, value: `cost : **${itemshop.cost}**\u000Acommand: \u000A/market buy **${itemshop.id}**`, inline: true })
    })
    fiels.push({ name: '**buy**', value: '</market buy:1160588971005444237>', inline: true })
    const reply = new EmbedBuilder()
      .setColor(interaction.member.displayHexColor)
      .setThumbnail(interaction.guild.iconURL())
      .setDescription(`page : **${page}**/${fielnot.length}`)
      .setTitle(`shop of ${interaction.guild}`)
      .addFields(fiels)
    const pre = new ButtonBuilder()
      .setStyle(ButtonStyle.Primary)
      .setCustomId("pagepreshop")
      .setLabel("page")
      .setEmoji("⏪")
      .setDisabled(page == 1)
    const suv = new ButtonBuilder()
      .setStyle(ButtonStyle.Success)
      .setCustomId("pagesuvshop")
      .setLabel("page")
      .setEmoji("⏩")
      .setDisabled(page == fielnot.length)
    const row = new ActionRowBuilder()
      .addComponents(pre, CancelButton.confirm, suv)
    this.row = row;
    this.embed = reply;
  }
}
class InventoryView {
  row;
  embed;
  constructor(interaction, page) {
    const guild = new GuildApi(interaction.guildId);
    const user = guild.user(interaction.member.id)
    const items = guild.items()
    const array = Object.keys(user.inventory).filter((element) => user.inventory[element] != 0)
    const fielnot = arrayMutil(array, 6)
    const fiels = []
    fielnot[page - 1].forEach((e) => {
      const number = user.inventory[e]
      const item = items[e]
      fiels.push({ name: `${item.icon} : *${item.name}*`, value: `number : **${number}**`, inline: true })
    })
    const reply = new EmbedBuilder()
      .setColor(interaction.member.displayHexColor)
      .setThumbnail(interaction.member.avatarURL())
      .setDescription(`page : **${page}**/${fielnot.length}`)
      .setTitle(`inventory of ${interaction.member.nickname}`)
      .addFields(fiels)
    const pre = new ButtonBuilder()
      .setStyle(ButtonStyle.Primary)
      .setCustomId("pagepreinv")
      .setLabel("page")
      .setEmoji("⏪")
      .setDisabled(page == 1)
    const suv = new ButtonBuilder()
      .setStyle(ButtonStyle.Success)
      .setCustomId("pagesuvinv")
      .setLabel("page")
      .setEmoji("⏩")
      .setDisabled(page == fielnot.length)
    const row = new ActionRowBuilder()
      .addComponents(pre, CancelButton.confirm, suv)
    this.row = row;
    this.embed = reply;
  }
}
module.exports = {
  CancelButton,
  GuildApi,
  ifReturn,
  arrayMutil,
  load,
  MarketView,
  InventoryView,
}
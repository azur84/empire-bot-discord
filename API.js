
const { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, rmSync } = require("fs");
const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
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
class GuildApi {
  channels = {
    group: ""
  }
  id = ""
  money = {
    icon: "",
    name: ""
  }
  users() { return new users(this.id) }
  items() { return new items(this.id) }
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
class users {
  constructor(guildID) {
    const files = readdirSync(`./serveur/${guildID}/users`);
    files.forEach(element => {
      const userpath = `./serveur/${guildID}/users/${element}`
      const { id } = require(userpath);
      this[id] = new user(userpath);
    });
  }
}
class user {
  constructor(path) {
    const files = readFileSync(path)
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
      const { id } = require(itemspath);
      this[id] = new Item(itemspath, guildID);
      this.toArrayPath.push(`./serveur/${guildID}/item/${element}`)
      this.toArray.push(id)
    });
  }
  newItem(id,name,icon = undefined,cp = 0) {
    const item = {
      id: id,
      name: name,
      cp: cp,
      icon: icon
    }
    writeFileSync(`./serveur/${this.GID}/item/${id}.json`,JSON.stringify(item))
    this[id] = new Item(`./serveur/${this.GID}/item/${id}.json`, this.GID);
  }
}
class Item {
  id = ""
  name = ""
  cp = new Number
  icon = ""
  GID = ""
  constructor(path, GID) {
    this.GID = GID
    const file = JSON.parse(readFileSync(path))
    this.id = file.id
    this.icon = file.icon
    this.cp = file.cp
    this.name = file.name
  }
  delete() {
    if (existsSync(`./serveur/${this.GID}/item/${this.id}.json`)){
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
}
module.exports = {
  CancelButton,
  GuildApi
}
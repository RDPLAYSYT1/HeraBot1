const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const mineflayer = require("mineflayer");
const { Client } = require('discord.js');
const axios = require('axios');

const sharedSecret = 'Pw_RD'; // Set your shared secret here

app.use(bodyParser.json());

app.get('/', (req, res) => res.send('RD YOUR BOT IS ONLINE NOW!'));

app.post('/authenticate', (req, res) => {
  const { secret } = req.body;

  if (secret === sharedSecret) {
    res.status(200).json({ message: 'Authentication successful' });
  } else {
    res.status(401).json({ message: 'Authentication failed' });
  }
});

app.post('/performAction', (req, res) => {
  const { secret, action } = req.body;

  if (secret === sharedSecret) {
    if (action === 'someAction') {
      res.status(200).json({ message: 'Action performed successfully' });
    } else {
      res.status(400).json({ message: 'Invalid action' });
    }
  } else {
    res.status(401).json({ message: 'Authentication failed' });
  }
});

const tpsPlugin = require('mineflayer-tps')(mineflayer);

const settings = {
  username: "Pw_RD.",
  host: "herobrine.org",
  version: "1.18.2"
};

const bot = mineflayer.createBot(settings);

bot.loadPlugin(tpsPlugin);

function tps() {
  bot.chat("Tps is " + bot.getTps());
}

let sell = true;

const blaze = {
  running: undefined,
  sellRunning: undefined,
  speed: 1500,
  on: () => {
    if (blaze.running) bot.chat("$");
    blaze.running = setInterval(() => {
      const filter = e => e.type === 'mob';
      const entityBlaze = bot.nearestEntity(filter);
      if (!entityBlaze) return;
      let pos = entityBlaze.position;
      bot.lookAt(pos);
      bot.attack(entityBlaze, true);
    }, blaze.speed);
  },
  off: () => {
    bot.chat("off");
    clearInterval(blaze.running);
    clearInterval(blaze.sellRunning);
  },
  sellOn: () => {
    bot.chat("on");
    sell = true;
  },
  sellOff: () => {
    bot.chat("off");
    sell = false;
  }
};

function chat(msg) {
  let text = msg.replace("chat", " ").trim();
  bot.chat(text);
}

const sneak = {
  state: undefined,
  on: () => {
    bot.chat("on");
    bot.setControlState('sneak', true);
  },
  off: () => {
    bot.chat("off");
    bot.setControlState('sneak', false);
  }
};

function slot(number) {
  let num = number.replace("slot", " ").trim();
  num = parseInt(num) - 1;
  bot.setQuickBarSlot(num);
}

function xp() {
  bot.chat(" Its only " + bot.experience.level);
}

function bal() {
  bot.chat("/bal");
  bot.on('messagestr', async (message) => {
    let msg = await message;
    if (msg.split(" ")[0].includes("Balance")) {
      bot.chat("Balance " + msg.split(" ")[1]);
    }
  });
}

function sellto() {
  setInterval(() => {
    bot.chat("/ ds qsell");
    bot.moveSlotItem(39, 0, handleError);
    bot.moveSlotItem(38, 0, handleError);
    bot.moveSlotItem(40, 0, handleError);
    bot.moveSlotItem(41, 0, handleError);
    bot.moveSlotItem(42, 0, handleError);
    bot.moveSlotItem(43, 0, handleError);
    bot.moveSlotItem(44, 0, handleError);
    bot.closeWindow(bot.inventory);
    console.log("sold");
  }, 4500);
}

setInterval(() => {
  bot.chat("/game hera");
}, 4500);

function handleError(err) {
  if (err) {
    console.error(err);
    process.exit(1); // This will cause the project to restart
  }
}

bot.on('spawn', () => {
  console.log('Bot spawned.');
  bot.chat("/game hera");
  setTimeout(() => {
    blaze.on();
    sellto();
  }, 4500);
});

bot.on('messagestr', async (message) => {
  let msg = await message;
  const date = new Date().toLocaleString();
  console.log(`${date} || ${msg}`);
  msg = msg.toLowerCase();

  bot.on('end', (reason) => {
  console.log('Bot disconnected:', reason);
});

  const ranks = ["[vip]", "[vip+]", "[vip++]", "[mvp]", "[mvp+]", "[mvp++]", "[hero]"];
  if (ranks.includes(msg.split(" ")[0])) {
    msg = msg.split(' ').slice(1).join(' ').trim();
  }

  const tiers = ["[i]", "[ii]", "[iii]", "[iv]", "[v]"];
  if (tiers.includes(msg.split(" ")[1])) {
    msg = msg.replace("[i]", " ").trim();
    msg = msg.replace("[ii]", " ").trim();
    msg = msg.replace("[iii]", " ").trim();
    msg = msg.replace("[iv]", " ").trim();
    msg = msg.replace("[v]", " ").trim();
  }

  if (msg.includes("you were kicked from")) {
    setTimeout(() => {
      bot.chat("/game hera");
    }, 4500);
  }

  const whitelist = ["rd_playsyt.", "zaidola."];
  if (whitelist.includes(msg.split(" ")[0])) {
    const author = msg.split(" ")[0];
    msg = msg.split(' ').slice(1).join(' ').trim();
    const prefix = "$";
    if (msg.includes(prefix)) {
      msg = msg.replace(prefix, " ").trim();

      switch (msg) {
        case "tps":
          tps();
          break;
        case "ba on":
          blaze.on();
          bot.chat("on");
          break;
        case "ba off":
          blaze.off();
          break;
        case "sell off":
          blaze.sellOff();
          break;
        case "sell on":
          blaze.sellOn();
          break;
        case "chat":
          chat(msg);
          break;
        case "slot":
          slot(msg);
          break;
        case "sn on":
          sneak.on();
          break;
        case "sn off":
          sneak.off();
          break;
        case "xp":
          xp();
          break;
        case "bal":
          bal();
          break;
        default:
          break;
      }
    }
  }
});

app.post('/keepalive', (req, res) => {
  const { secret } = req.body;

  if (secret === sharedSecret) {
    res.status(200).json({ message: 'Keep-alive received' });
  } else {
    res.status(401).json({ message: 'Authentication failed' });
  }
});

app.listen(port, () => {
  console.log(`Your app is listening at http://localhost:${port}`);
});

function sendKeepAlive() {
  axios.post('http://localhost:3000/keepalive', { secret: sharedSecret })
    .then((response) => {
      if (response.status === 200) {
        console.log(response.data.message);
      } else {
        console.error('Unexpected response status:', response.status);
      }
    })
    .catch((error) => {
      console.error('Error sending keep-alive:', error.message);
    });
}

function reauthenticate() {
  const authenticationPayload = { secret: sharedSecret };
  axios.post('http://localhost:3000/authenticate', authenticationPayload)
    .then((response) => {
      if (response.status === 200) {
        console.log(response.data.message);
      } else {
        console.error('Unexpected response status during reauthentication:', response.status);
      }
    })
    .catch((error) => {
      console.error('Error during reauthentication:', error.message);
    });
}

// When bot spawns
bot.on('spawn', () => {
  // Perform necessary actions on bot spawn
  // For example, you can call your blaze.on() and sellto() logic here.

  // Schedule a periodic reauthentication to keep the bot logged in
  const reauthInterval = setInterval(reauthenticate, 600000); // 10 minutes
  
  // Handle the 'end' event to clear the reauthentication interval
  bot.on('end', () => {
    clearInterval(reauthInterval);
    console.log('Bot disconnected. Attempting reauthentication...');
    reauthenticate();
  });
});

// Automatically restart the Replit project on error
process.on('unhandledRejection', (err) => {
  console.error('Unhandled promise rejection:', err);
  process.exit(1); // This will cause the project to restart
});

// Function to handle errors during item movement
function handleError(err) {
  if (err) console.error(err);
}


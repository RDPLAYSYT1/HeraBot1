const mineflayer = require("mineflayer");
const { basename } = require("path");
const { off } = require("process");
//const navigatePlugin = require('mineflayer-navigate')(mineflayer);
var tpsPlugin = require('mineflayer-tps')(mineflayer);
// const antiafk = require("mineflayer-antiafk");

var settings = {
    username: "Pw_RD",
    host: "herobrine.org",
    version: "1.18.2"
};

const bot = mineflayer.createBot(settings);

bot.loadPlugin(tpsPlugin)
//navigatePlugin(bot)
// bot.loadPlugin(antiafk);

// -----Functions-----
function tps() {
    bot.chat("Tps is " + bot.getTps())
}
let sell = true
const blaze = {
    running: undefined,
    sellRunning: undefined,
    speed: 1500,
    on: () => {
        if (blaze.running) bot.chat("$");
        blaze.running = 
            setInterval(() => {
            const filter = e => e.type === 'mob';
            const entityBlaze = bot.nearestEntity(filter);
            if (!entityBlaze) return;
            let pos = entityBlaze.position
            //bot.navigate.to(pos)
            bot.lookAt(pos)
            bot.attack(entityBlaze, true)
        }, blaze.speed);
        
    },
    off: () => {
        bot.chat("off")
        blaze.running = clearInterval(blaze.running);
        blaze.sellRunning = clearInterval(blaze.sellRunning)
    },
    sellOn: () => {
        bot.chat("on") 
        sell = true
    },
    sellOff: () => {
        bot.chat("off")
        sell = false
    }
}
function chat(msg) {
    let text = msg.replace("chat", " ").trim()
    bot.chat(text)
}
const sneak = {
    state: undefined,
    on: () => {
        bot.chat("on")
        bot.setControlState('sneak', true)
    },
    off: () => {
        bot.chat("off")
        bot.setControlState('sneak', false)
    }
}
function slot(number){
    let num = number.replace("slot", " ").trim()
    num = parseInt(num) - 1;
    bot.setQuickBarSlot(num)
}
function xp() {
    bot.chat("Current xp level is " + bot.experience.level)
}
function bal() {
    bot.chat("/bal")
    bot.on('messagestr', async (message) => {
        let msg = await message
        if (msg.split(" ")[0].includes("Balance")) {
            bot.chat("Balance " + msg.split(" ")[1])
        }
    })
}
const afk = {
    on: () => {
        bot.afk.start()
        bot.chat("on")
    },
    off: () => {
        bot.afk.stop()
        bot.chat("off")
    }
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
    bot.chat("/game hera")
}, 4500);

// When bot spawns
bot.on('spawn', () => {
    bot.chat("/game hera")
    setTimeout(() => {
        blaze.on()
        sellto()
    }, 4500);
})

// When msg is sent in chat 
bot.on('messagestr', async (message) => {
    // log msg to console
    let msg = await message;
    const date = new Date().toLocaleString();;
    console.log(`${date} || ${msg}`)
    msg = msg.toLowerCase()

    // Check and Remove Ranks
    ranks = ["[vip]", "[vip+]", "[vip++]", "[mvp]", "[mvp+]", "[mvp++]", "[hero]"]
    if (ranks.includes(msg.split(" ")[0])) {
        msg = msg.split(' ').slice(1).join(' ').trim()
        // console.log(msg)
    }

    // Check and Remove Tiers
    tiers = ["[i]", "[ii]", "[iii]", "[iv]", "[v]"]
    if (tiers.includes(msg.split(" ")[1])) {
        msg = msg.replace("[i]", " ").trim()
        msg = msg.replace("[ii]", " ").trim()
        msg = msg.replace("[iii]", " ").trim()
        msg = msg.replace("[iv]", " ").trim()
        msg = msg.replace("[v]", " ").trim()
        //console.log(msg)
    }

    // auto-reconect 
    if(msg.includes("you were kicked from")) {
        setTimeout(( ) => {
            bot.chat("/game hera")
        }, 2000)
    }

    // Enforce Whitelist
    whitelist = ["rd_playsyt.","hello4hao.","galson2008."]
    if (whitelist.includes(msg.split(" ")[0])){
        // get and remove msg author
        author = msg.split(" ")[0]
        msg = msg.split(' ').slice(1).join(' ').trim()

        // check and remove prefix
        prefix = "$"
        if (msg.includes(prefix)){
            msg = msg.replace(prefix, " ").trim()

            // check for command
            if (msg === "tps") tps();
            else if (msg === "ba on") {
                blaze.on() 
                bot.chat("on")}
            else if (msg === "ba off") blaze.off();
            else if (msg === "sell off") blaze.sellOff();
            else if (msg === "sell on") blaze.sellOn();
            else if (msg.includes("chat")) chat(msg);
            else if (msg.includes("slot")) slot(msg);
            else if (msg === "sn on") sneak.on();
            else if (msg === "sn off") sneak.off();
            else if (msg === "xp") xp();
            else if (msg === "bal") bal();
            //else if (msg === "afk off") afk.off();
            //else if (msg === "afk on") afk.on();
        }


    }
})

// Function to handle errors during item movement
function handleError(err) {
  if (err) console.error(err);
}
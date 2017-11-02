 
const fs = require("fs");
const gear = require('../../gearbox.js')
const paths = require("../../paths.js");
const PixelCore = require('canvasutil').PixelCore
const pixelProcessor = new PixelCore();
const Pixly = require("pixel-util");
const Jimp = require("jimp");
const Canvas = require("canvas");
const opentype = require("opentype.js");
const drawText = require("node-canvas-text").default;
const locale = require('../../../utils/multilang_b');

const ITEMS = JSON.parse(fs.readFileSync("./resources/lists/items.json","utf8"))

const mm = locale.getT();

 

var cmd = 'lootbox';

var LOOT = require("../../archetypes/lootbox.js")

var init = async function (message,userDB,DB) {
try{ 
  //if(message.author.id!= "88120564400553984")return;
  const LANG=message.lang
  let P={lngs:LANG}

  if(!message.guild.member(message.botUser.user).hasPermission(['MANAGE_MESSAGES','ATTACH_FILES','EMBED_LINKS'])){
    return message.reply(mm('CMD.insuperms', {
                lngs: message.lang,
                prefix: message.prefix
            }));
  };
  
  let inventory = message.author.dDATA.modules.inventory

  let boxes = {}

  for (i=0;i<inventory.length;i++){
    
    if (ITEMS[inventory[i]].type =="box"){
      boxes[inventory[i]] ? boxes[inventory[i]]++ : boxes[inventory[i]] = 1;  
    }
  }
    let invent_prompt = ""
    
    let embed = new gear.Discord.RichEmbed
    embed.setColor("#ff52bc")
    let avlb = {}

    for (i in boxes) {

       let _R = ITEMS[i].rarity
       let cmmde = ITEMS[i].rarity
       
      if (ITEMS[i].event) {
        cmmde = "EV"
        if (!avlb.EV)avlb.EV = [];
        avlb.EV.push(ITEMS[i].id)
      }else{
        
        if (!avlb[_R])avlb[_R] = [];
        avlb[_R].push(ITEMS[i].id)
      }
        
        
        

        embed.addField(gear.emoji(_R) + (ITEMS[i].altemoji || "") + ` ${ITEMS[i].name}   `,
          `${gear.emoji(ITEMS[i].emoji)}` + ` x${boxes[i]}
\`open ${cmmde}\` to open this box.`,
          false
        )


    }
  
  
    
    if (inventory.length==0){
      embed.setColor("#d84343")
      embed.description=gear.emoji("nope")+" No Lootboxes to Open"
    }
    message.channel.send({embed})
    
       
      const responses = await message.channel.awaitMessages(msg2 =>
          msg2.author.id === message.author.id && (
               msg2.content.toLowerCase().includes("lootbox")  
            || (avlb.U  && msg2.content.toLowerCase() === ("open u")  )
            || (avlb.R  && msg2.content.toLowerCase() === ("open r")  )
            || (avlb.UR && msg2.content.toLowerCase() === ("open ur") )
            || (avlb.SR && msg2.content.toLowerCase() === ("open sr") )
            || (avlb.EV && msg2.content.toLowerCase() === ("open ev") )
            || (avlb.C  && msg2.content.toLowerCase() === ("open")    )
            || (avlb.C  && msg2.content.toLowerCase() === ("open c")  )
            || (msg2.content.toLowerCase() === ("open b0b")  )
          ), {
            maxMatches: 1,
            time: 30e3
          });

        if (responses.size === 0) return;

        const action = responses.first().content.toUpperCase();
        let A;
        if (action.includes("LOOTBOX")) return message.channel.send(gear.emoji("nope"));
        if (action == "OPEN"){
           A="C"
        }
        else{
           A=action.split(/ +/)[1]
        }
    
    
    
          //   ITEMS[avlb[A][0]].event
          if([A]=="B0B")return message.reply("u very indian");
  
          if(!avlb[A])return message.reply(mm("loot.notThisbox",{lngs:LANG,prefix:message.prefix}));
          
          let Ty = A
          let Ev = ""
          
          
          if(A=="EV"){
            Ty= ITEMS[avlb[A][0]].rarity
            Ev= ITEMS[avlb[A][0]].event.replace(":","")
          }

  
          let mess=message;
              mess.content = "loot "+Ty
  
  
          try{ 
              require("../dev/loot.js").init(mess,userDB,DB,"pollux",undefined,Ev)
            message.author.dDATA.modules.inventory.splice(inventory.indexOf(avlb[A][0]),1) //less shit
            
            await userDB.update({_id:message.author.id},message.author.dDATA)
            
          }catch(e){
            message.reply("ERROR")
          }
          
    
   
   
   
   }catch(e){
    console.log(e)
  }

    }

 module.exports = {
    pub:true,
    cmd: cmd,
    perms: 3,
    init: init,
    cat: 'misc'
};


const cmd = 'switches';
const gear = require("../../gearbox.js");

const init = function (message,userDB,DB) {

let emb = new gear.Discord.RichEmbed
 gear.channelDB.findOne({_id:message.channel.id}).then(chaninfo=>{

 function icona(x){
   return x ? gear.emoji("yep") : gear.emoji("nope")
 }

  emb.addField("NSFW",icona(message.channel.nsfw),true)
  emb.addField("Level Up",icona(chaninfo.modules.LVUP),true)
  emb.addField("Drops",icona(chaninfo.modules.DROPS),true)
  emb.addField("Disabled Commands","```"+chaninfo.modules.DISABLED+"```")
  emb.setFooter(message.guild.name,message.guild.iconURL)

message.channel.send({embed:emb})

 })

};

 module.exports = {
    pub:true,
    cmd: cmd,
    perms: 3,
    init: init,
    cat: 'infra'
};

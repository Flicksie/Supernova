const gear = require('../../gearbox.js');
//const locale = require('../../../utils/multilang_b');
//const mm = locale.getT();

const cmd = 'key'

const init = async function(message,params){
  try{


let inventory =(await gear.userDB.findOne({id:message.author.id},{"modules.inventory":1}).lean().exec()).modules.inventory;
let items = (await gear.items.find({id:{$in: inventory}})).filter(itm=>itm.type=='key');
async function iqnt(item){

  return (await gear.userDB.findOne({id:message.author.id},{"modules.inventory":1}) ).modules.inventory.filter(it=>it==item).length;

}

  let embed = new gear.RichEmbed
  embed.setColor("#8c62a2")
  embed.setDescription(":card_box: **Key Items Iventory**")
  //embed.addBlankField()


  for (i=0;i<items.length;i++){
      let buyer = items[i].buyable? gear.emoji('buyable'): ''
  let breaker = items[i].destroyable? gear.emoji('breakable'): ''
  let trader = items[i].tradeable? gear.emoji('tradeable'): ''

    let itmquant = await iqnt(items[i].id);
   embed.addField(items[i].emoji+" "+items[i].name+" **`x"+itmquant+"`**",buyer+breaker+trader+gear.emoji(items[i].rarity))
  }
if (items.length>0) embed.setThumbnail("https://pollux.fun/build/invent/key_on.png");
else {
 let demotivational = gear.demotiv
    let rand = gear.randomize(1,demotivational.length)
    
  embed.setThumbnail("https://pollux.fun/build/invent/key_off.png");
  embed.description += "\n\n*"+demotivational[rand-1]+"*"
}
 message.channel.send(embed)


  }catch(e){
    console.error(e)
  }
}

 module.exports = {
    pub:false,
    cmd: cmd,
    perms: 3,
    init: init,
    cat: 'inventory'
};

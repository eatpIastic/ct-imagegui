/// <reference types="../CTAutocomplete" />

import PogObject from "PogData";

let editing = 0;
let doLast = true;
register("command", (...args) => {
  if(args.length>1 && args[0] === "add") {
    doLast = false
    data.images.push(args[1]);
    getImgs();
    doLast = true
    data.x.push(100)
    data.y.push(100)
    data.save();
  } else if(args.length>=1 && args[0] === "list") {
    ChatLib.chat(data.images.toString());
  } else if(args.length==2 && args[0] === "edit") {
    editing = parseInt(args[1])
    gui.open();
  } else if(args.length==2 && args[0] === "remove") {
    doLast = false
    data.images.splice(parseInt(args[1]), 1);
    data.x.splice(parseInt(args[1]), 1);
    data.y.splice(parseInt(args[1]), 1);
    getImgs();
    doLast = true
    data.save();
  } else if(args.length==1 && args[0] === "toggle") {
    data.display = !data.display;
    data.save();
    ChatLib.chat("&b[Image] &fDisplay set to " + data.display); 
  }else {
    ChatLib.chat("&b[Image] &fUsage: \n/img add <url> \n/img list \n/img edit <index> \n/img remove <index>\n/img toggle");
  }
}).setName("imagegui").setAliases(["imggui", "img"]);

let gui = new Gui();
let data = new PogObject("imagegui", {
  "images": [],
  "x": [],
  "y": [],
  "display": true,
  "first_time": true
}, ".img_data.json");

register("command", () => {
  data.images = []
  data.x = []
  data.y = []
  data.display = true
  data.first_time = true
  data.save()
  ChatLib.chat("&b[Image] &fReset data")
  getImgs()
}).setName("resetimgdata")

if(data.first_time) {
  ChatLib.chat("&b[ImageGUI] &fDo /img for configuration");
  data.first_time = false;
  data.save();
}

let imgs;
getImgs();

function getImgs() {
  imgs = [];
  for(let i = 0; i < data.images.length; i++) {
    imgs.push(new Image(data.images[i].split("/")[data.images[i].split("/").length-1], data.images[i]));
  }
}

register("renderOverlay", () => {
  if(!data.display) return;
  if(!Client.isInGui() || Client.isInChat()) return;
  if(gui.isOpen()) {
    const txt = "Click anywhere to move!";
    Renderer.drawStringWithShadow(txt, Renderer.screen.getWidth()/2 - Renderer.getStringWidth(txt)/2, Renderer.screen.getHeight()/2)
  }

  try{
  for(let i = 0; i < imgs.length-(doLast ? 0 : 1); i++) {
    let img = imgs[i];
    let x = data.x[i];
    let y = data.y[i];
    img.draw(x,y);
  }
} catch(e) {console.log(e.toString())}
});

register("dragged", (dx, dy, x, y) => {
  if (!gui.isOpen()) return;
  data.x[editing] = x;
  data.y[editing] = y;
  data.save();
});

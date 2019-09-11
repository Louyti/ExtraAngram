const ctx = plot.getContext("2d");

plot.width = document.body.clientWidth;
plot.height = document.body.clientHeight;

let images = {
  c: {
    pic: new Image(),
    left: 50
  },
  h: {
    pic: new Image(),
    left: 105
  },
  i: {
    pic: new Image(),
    left: 225
  },
  dot: {
    pic: new Image(),
    left: 200
  },
  s: {
    pic: new Image(),
    left: 45
  }
}

var scale = 0.5;

images.dot.pic.src = "images/rsz_dot.png";
images.i.pic.src = "images/rsz_i.png";
images.h.pic.src = "images/rsz_h.png";
images.c.pic.src = "images/c.png";
images.s.pic.src = "images/s.png";

let inputString = "";
let outputString = "";

var animating = false;

var movers;

function display(string) {
  if(!animating){
    ctx.clearRect(0, 0, plot.width, plot.height);
    for (i = 0; i < string.length; i++) {
      if (blockData.letters[string[i]]) {
        let segments = blockData.letters[string[i]];
        for (o of segments) {
          let image = images[o.type];
          let rx = (380 + i * 500 + Number(o.align)) * scale;
          let ry = (900 + 500 * -Number(o.level)) * scale;
          let scx = Number(o.scx);
          let scy = Number(o.scy);
          if (o.flip && o.flip == "true") scx *= -1;
          ctx.translate(rx, ry);
          ctx.rotate(Math.PI / 180 * Number(o.rotation));
          ctx.scale(scx * scale, scy * scale);
          ctx.drawImage(image.pic, -((500 - image.left * 2) / 2), -250);
          ctx.scale(1 / (scx * scale), 1 / (scy * scale));
          ctx.rotate(-Math.PI / 180 * Number(o.rotation))
          ctx.translate(-rx, -ry);
        }
      }
    }
  }
}

function getValue(string) {
  let ret = {
    c: 0,
    h: 0,
    i: 0,
    dot: 0,
    s: 0
  };
  for (i of string) {
    let segments = blockData.letters[i];
    try{
      for (o of segments) {
        ret[o.type]++;
      }
    } catch (e) {
      //console.log(string);
    }
  }
  return ret;
}

function prepare(string) {
  let ret = {
    c: [],
    h: [],
    i: [],
    dot: [],
    s: []
  };
  for (i = 0; i < string.length; i++) {
    let segments = blockData.letters[string[i]];
    for (o of segments) {
      let rx = (380 + i * 500 + Number(o.align)) * scale;
      let ry = (900 + 500 * -Number(o.level)) * scale;
      let scx = Number(o.scx);
      let scy = Number(o.scy);
      if (o.flip && o.flip == "true") scx *= -1;
      ret[o.type].push({
        x: rx,
        y: ry,
        rot: Number(o.rotation),
        sx: scx * scale,
        sy: scy * scale
      });
    }
  }
  return ret;
}

function launchAnimation(str1, str2, time) {
  animating = true;
  document.getElementById("in").blur();
  display(str1);
  movers = prepare(str1);
  var targets = prepare(str2);
  for (i in movers) {
    for (o = 0; o < movers[i].length; o++) {
      let mo = movers[i][o];
      let to = targets[i][o];
      mo.xkey = (to.x - mo.x) / time;
      mo.ykey = (to.y - mo.y) / time;
      mo.rotkey = (to.rot - mo.rot) / time;
      mo.sxkey = (to.sx - mo.sx) / time;
      mo.sykey = (to.sy - mo.sy) / time;
    }
    //console.log(movers[i]);
  }
  drawAnimation(0, time);
}

function drawAnimation(key, time) {
  ctx.clearRect(0, 0, plot.width, plot.height);
  for (i in movers) {
    for (o of movers[i]) {
      o.x += o.xkey;
      o.y += o.ykey;
      o.rot += o.rotkey;
      o.sx += o.sxkey;
      o.sy += o.sykey;
      let image = images[i];
      ctx.translate(o.x, o.y);
      ctx.rotate(Math.PI / 180 * Number(o.rot));
      ctx.scale(o.sx, o.sy);
      ctx.drawImage(image.pic, -((500 - image.left * 2) / 2), -250);
      ctx.scale(1 / o.sx, 1 / o.sy);
      ctx.rotate(-Math.PI / 180 * Number(o.rot))
      ctx.translate(-o.x, -o.y);
    }
  }
  if (key < time) {
    setTimeout(() => drawAnimation(key + 1, time), 20);
  } else {
    finishAnimation();
  }
}

function findwords(str1) {
  let ret = [];
  for (vards of vardi) {
    let tvards = vards.toLowerCase();
    if (compareWords(str1, tvards)) ret.push(tvards);
  }
  return ret;
}

function findword(str1) {
  for (vards of vardi) {
    let tvards = vards.toLowerCase();
    if (compareWords(str1, tvards)) return tvards;
  }
  return null;
}

function compareWords(val1, val2) {
  let get1 = getValue(val1);
  let get2 = getValue(val2);
  for (i in get1) {
    if (get1[i] !== get2[i]) return false;
  }
  return true;
}

function transform() {
  if(!animating){
    let words = findwords(inputString);
    document.getElementById("iespejamovardudaudzums").innerHTML = words.length;
    document.getElementById("dati").innerHTML = JSON.stringify(getValue(inputString));
    if(words.length > 0){
      outputString = words[Math.floor(Math.random() * words.length)];
      if(words.length > 1){
        while(outputString == inputString){
          outputString = words[Math.floor(Math.random() * words.length)];
        }
      }
      if (outputString) {
        launchAnimation(inputString, outputString, atrums.value);
      }
    } else {
      alert("Šim vārdam nav līdzīgo!");
    }
  }
}

function finishAnimation() {
  inputString = outputString;
  animating = false;
  document.getElementById("in").focus();
  document.getElementById('in').value = inputString;
  checkScreen();
}

function checkScreen() {
  inputString = document.getElementById('in').value.toLowerCase();
  if ((380 + inputString.length * 500) * scale > document.body.clientWidth - 10) {
    scale *= 0.93;
  }
  display(inputString);
}

const node = document.getElementById('in');
node.addEventListener("keyup", (event) => {
  if (event.code == "Enter") {
      transform();
  }
});

images.s.pic.onload = () => {
  display(inputString);
  //launchAnimation(inputString, outputString, 100);
};

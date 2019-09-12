
function launch(){
  var top10count = new Set([0]);
  var top10 = [];

  var wordscores = [];

  for(i of vardi){
    wordscores.push(getValue(i.toLowerCase()));
  }

  var topname = "";
  var topc = 0;
  for(i = 0; i < 10; i++){
    top10.push({word: "", count: 0});
  }

  for(v = 0; v < vardi.length; v++){
    wr = vardi[v].toLowerCase();
    let c = findwordsplus(wr).length
    if(c > top10[9].count && !top10count.has(c)){
      for(i = 0; i < 10; i++){
        let ir = top10[i];
        if(ir.count < c){
          top10.splice(i, 0, {word: wr, count: c});
          top10.pop();
          top10count.add(c);
          break;
        }
      }
    }
  }


  /*
  for(v = 0; v < 100; v++){
    wr = vardi[v].toLowerCase();
    let c = findwords(wr).length
    if(c > topc){
      topc = c;
      topname = wr;
    }
  }*/

  console.log(top10);
}

var wordscores = [];

for(i of vardi){
  wordscores.push(getValue(i.toLowerCase()));
}

function longeth(){
  var vards = "";
  for(v = 0; v < vardi.length; v++){
    let wr = vardi[v].toLowerCase();
    if(vards.length < vardi[v].length && findwordsplus(wr).length > 1) vards = wr;
  }
  console.log(vards);
}

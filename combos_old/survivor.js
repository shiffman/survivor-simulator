
var players;

var mnames;
var wnames;
var combos10;

var castP;
var countP;

var castDivs = [];

var mwCombos;

var slider;
var sliderTxt;

function preload() {
  players = loadJSON('players.json');
}

function setup() {
  noCanvas();
  countP = getElement('count');

  var men = players.men;
  var women = players.women;

  mnames = [];
  wnames = [];

  for (var i = 0; i < men.length; i++) {
    mnames.push(men[i].name);
  }
  for (var i = 0; i < men.length; i++) {
    wnames.push(women[i].name);
  }

  for (var i = 0; i < 20; i++) {
    var div = createDiv('test');
      div.class('player');
    if (i < 10) {
      div.class('right');
    } else {
      div.class('left');
    }

    if ((i < 10 && i % 2 === 0) || (i > 10 && i % 2 === 1)) {
      div.style('background-color','#888');
    } else {
      div.style('background-color','#666');
      div.style('color','#FFF');
    }

    div.parent('cast');
    castDivs.push(div);


  }
   
  var a = 10;
  var b = 16;
  combos10 = comb(a,b);
  
  mwCombos = new Int16Array(8008*8008*2);
  var spot = 0;
  for (var i = 0; i < 8008; i++) {
    for (var j = 0; j < 8008; j++) {
      mwCombos[spot] = i;
      mwCombos[spot+1] = j;
      spot+=2;
    }
  }

  sliderTxt = createP('test');
  sliderTxt.parent('slider');

  slider = createSlider(0, mwCombos.length/2-1, 0);
  slider.parent('slider');
  slider.style('width','300px');
  slider.elt.oninput = newCast;
  newCast();


  noLoop();


}


function newCast() {
  possible = floor(slider.value())*2;
  sliderTxt.html(slider.value());

  wCount = mwCombos[possible + 0];
  mCount = mwCombos[possible + 1];

  var currentMen = combos10[mCount].split(',');
  var currentWomen = combos10[wCount].split(',');

  for (var i = 0; i < currentWomen.length-1; i++) {
    castDivs[i].html((i+11) + ': ' + mnames[currentMen[i]]);
  }
  for (var i = 0; i < currentMen.length-1; i++) {
    castDivs[i+10].html((i+1) + ': ' + wnames[currentWomen[i]]);
  }
}






// function sameCast(cast1, cast2) {
//   if (cast1.length !== cast2.length) {
//     console.log('ooops, casts have different sizes?');
//   }
//   var same = true;
//   for (var i = 0; i < cast1.length; i++) {
//     if (cast1[i] !== cast2[i]) {
//       same = false;
//       break;
//     }
//   }
//   return same;
// }

// function createRandomCast(mnames, wnames) {
//   var mtemp = mnames.slice();
//   var wtemp = wnames.slice();
//   var cast = [];
//   for (i = 0; i < 10; i++) {
//     var mpick = int(random(mtemp.length));
//     cast.push(mtemp.splice(mpick,1)[0]);
//     var wpick = int(random(wtemp.length));
//     cast.push(wtemp.splice(wpick,1)[0]);
//   }
//   cast.sort();
//   return cast;
// }


var simSpeed;

var playerlookup = {};

function preload() {
  players = loadJSON('players.json');
}

function setup() {
  noCanvas();

  var speedSlider = getElement('speed');
  speedSlider.value(80);
  simSpeed = speedSlider.value();

  speedSlider.elt.oninput = function() {
    simSpeed = this.value;
    var show = getElement('simspeed');
    if (simSpeed < 20) {
      show.html("slow");
    } else if (simSpeed < 40) {
      show.html("medium slow");
    } else if (simSpeed < 60) {
      show.html("medium");
    } else if (simSpeed < 80) {
      show.html("medium fast");
    } else {
      show.html("fast");
    }
  };
  speedSlider.elt.oninput();
  
  // A lookup by id object
  // only works b/c same # of men and women
  for (var i = 0; i < players.men.length; i++) {
    playerlookup[players.men[i].id] = players.men[i];
    playerlookup[players.women[i].id] = players.women[i];
  }
  makeTable('women');
  makeTable('men');
  getElement('once').mousePressed(simulate);
}


var tribes;
var merged;
var winner;
var loser;
var state;

function simulate() {
  tribes = [];
  merged = false;
  state = 'immunity';
  winner = -1;
  loser = -1;

  getElement('simulation').show();
  
  var women = [];
  var men = [];
  for (var i = 0; i < 20; i++) {
    var gender = 'women';
    var num = i;
    if (i >= 10) {
      gender = 'men';
      num -= 10;
    }
    var name = getElement(gender + '_' + num);
    var player = playerlookup[name.value()];
    if (gender === 'women') {
      women.push(player);
    } else {
      men.push(player);
    }
  }

  var tribe1 = [];
  var tribe2 = [];
  
  for (var i = 0; i < 5; i++) {
    var pick1 = int(random(women.length));
    tribe1.push(women[pick1]);
    women.splice(pick1,1);

    var pick2 = int(random(men.length));
    tribe1.push(men[pick2]);
    men.splice(pick2,1);
  }

  for (var i = 0; i < women.length; i++) {
    tribe2.push(women[i]);
    tribe2.push(men[i]);
  }

  tribes[0] = tribe1;
  tribes[1] = tribe2;
  showTribes();
  getElement('tribe1name').html("Tribe 1");
  getElement('tribe2name').html("Tribe 2");

  
  go();
}

function go() {
  var statusDiv = getElement('status');
  if (!merged) {
    if (tribes[0].length + tribes[1].length === 12) {
      merged = true;
      for (var i = 0; i < tribes[1].length; i++) {
        tribes[0].push(tribes[1][i]);
      }
      tribes[1] = [];
      statusDiv.html('Tribes are merged.');
      state = 'immunity';
      getElement('tribe1name').html("Merge tribe");
      getElement('tribe2name').html("Jury");
    } else {
      var tribeDivs = [];
      tribeDivs[0] = getElement('tribe1');
      tribeDivs[1] = getElement('tribe2');
      if (state === 'immunity') {
        winner = int(random(0,2));
        loser = 0;
        if (winner === 0) loser = 1;
        //tribeDivs[winner].style('background-color','#00FF00');
        //tribeDivs[loser].style('background-color','#FF0000');
        state = 'tribal';
        statusDiv.html('Tribe ' + (winner+1) + ' wins immunity!');
      } else if (state === 'tribal') {
        var tribe = tribes[loser];
        var pick = int(random(tribe.length));
        var votedout = tribe[pick];
        tribe.splice(pick,1);
        statusDiv.html(votedout.name + ' voted out at tribal council!');
        state = 'immunity';
      }
    }
  } else {
    var tribe = tribes[0];
    if (tribe.length > 3) {
      if (state === 'immunity') {
        winner = int(random(tribe.length));
        var immune = tribe[winner];
        state = 'tribal';
        statusDiv.html(immune.name + ' wins immunity!');
      } else if (state === 'tribal') {
        var immune = tribe[winner];
        var tribecopy = tribe.slice();
        tribecopy.splice(winner,1);
        var out = int(random(tribecopy.length));
        var votedout = tribecopy[out];
        tribecopy.splice(out,1);
        tribes[0] = tribecopy;
        tribes[0].push(immune);
        statusDiv.html(votedout.name + ' voted out at tribal council!');
        tribes[1].push(votedout);
        state = 'immunity';
      }
    } else {
      if (state === 'final') {
        for (var i = 0; i < tribe[1].length; i++) {
          var vote = int(random(3));
          tribe[0][vote].vote++;
        }
        var soleSurvivor = tribes[0][1];
        for (var i = 1; i < tribes[0].length; i++) {
          if (tribes[0][i].vote > winner.vote) {
            soleSurvivor = tribes[0][i];
          }
        }
        statusDiv.html("The sole survivor is " + soleSurvivor.name + "!");
        state = 'gameover';
      } else {
        state = 'final';
        statusDiv.html("Tallying final tribal votes!");
      }
    }
  }
  showTribes();
  var wait = map(simSpeed,1,100,1000,10);
  if (!merged) {
    setTimeout(go,wait);
  } else if (state !== 'gameover') {
    setTimeout(go,wait);
  }
}




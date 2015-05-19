var simSpeed;

var playerlookup = {};
var playerlist = [];

var totalSims = 0;

function preload() {
  players = loadJSON('players.json');
}

function setup() {
  noCanvas();

  var speedSlider = getElement('speed');
  simSpeed = speedSlider.value();
  speedSlider.elt.oninput = function() {
    simSpeed = this.value;
  };
  speedSlider.elt.oninput();
  
  // A lookup by id object
  // only works b/c same # of men and women
  for (var i = 0; i < players.men.length; i++) {
    playerlookup[players.men[i].id] = players.men[i];
    playerlookup[players.women[i].id] = players.women[i];
    playerlist.push(players.men[i]);
    playerlist.push(players.women[i]);
  }

  for (i = 0; i < playerlist.length; i++) {
    playerlist[i].totalWins = 0;
    playerlist[i].teamWins = 0;
    playerlist[i].immunities = 0;
    playerlist[i].merges = 0;
    playerlist[i].placement = 0;
    playerlist[i].sumplace = 0;
    playerlist[i].avgplace = 0;
    playerlist[i].playing = false;
  }


  makeTable('women');
  makeTable('men');
  getElement('once').mousePressed(runonce);
  getElement('loop').mousePressed(loopIt);
}


var tribes;
var merged;
var winner;
var loser;
var state;

var week = 1;

var looping = false;

function loopIt() {
  if (looping) {
    looping = false;
    this.html('RUN CONTINUOUSLY');
  } else {
    looping = true;
    this.html('STOP SIMULATION');
    simulate();
  }
}

function runonce() {
  looping = false;
  simulate();
}

function simulate() {
  totalSims++;

  tribes = [];
  merged = false;
  state = 'immunity';
  winner = -1;
  loser = -1;
  week = 1;

  getElement('simulation').show();
  getElement('stats').show();
  
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
    player.playing = true;
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
      // Everyone makes the merge!
      for (var i = 0; i < tribes[0].length; i++) {
        tribes[0][i].merges++;
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
        
        winner = tribalImmunity(tribes);
        // Everybody gets a team win!
        for (var i = 0; i < tribes[winner].length; i++) {
          tribes[winner][i].teamWins++;
        }

        loser = 0;
        if (winner === 0) loser = 1;
        //tribeDivs[winner].style('background-color','#00FF00');
        //tribeDivs[loser].style('background-color','#FF0000');
        state = 'tribal';
        statusDiv.html('Tribe ' + (winner+1) + ' wins immunity!');
      } else if (state === 'tribal') {
        var losingTribe = tribes[loser];
        var pick = voting(tribes[loser]);
        
        // TODO: break out being voted out to function
        var out = losingTribe[pick];
        out.placement = 21 - week;
        out.sumplace += out.placement;
        out.avgplace = out.sumplace / totalSims;
        week++;

        losingTribe.splice(pick,1);
        statusDiv.html(out.name + ' voted out at tribal council!');
        state = 'immunity';
      }
    }
  } else {
    var tribe = tribes[0];
    if (tribe.length > 3) {
      if (state === 'immunity') {
        winner = individualImmunity(tribe);
        var immune = tribe[winner];
        immune.immunities++;
        state = 'tribal';
        statusDiv.html(immune.name + ' wins immunity!');
      } else if (state === 'tribal') {
        // TODO: break this out into selection function?
        var immune = tribe[winner];
        var tribecopy = tribe.slice();
        tribecopy.splice(winner,1);
        var out = voting(tribecopy);

        // TODO: break out being voted out to function
        var votedout = tribecopy[out];
        votedout.placement = 21 - week;
        votedout.sumplace += votedout.placement;
        votedout.avgplace = votedout.sumplace / totalSims;
        week++;
        
        tribecopy.splice(out,1);
        tribes[0] = tribecopy;
        tribes[0].push(immune);
        statusDiv.html(votedout.name + ' voted out at tribal council!');
        tribes[1].push(votedout);
        state = 'immunity';
      }
    } else {
      if (state === 'final') {
        var soleSurvivor = votingWinner(tribes[0],tribes[1]);
        soleSurvivor.totalWins++;
        statusDiv.html("The sole survivor is " + soleSurvivor.name + "!");
        state = 'gameover';
      } else {
        state = 'final';
        statusDiv.html("Tallying final tribal votes!");
      }
    }
  }
  showTribes();
  var wait = map(simSpeed,1,100,1000,0);
  // finished
  if (state === 'gameover') {
    if (looping) {
      // restarts the whole thing
      simulate();
    }
  // In all other scenarios, advance the game one week
  } else {
    setTimeout(go,wait);
  }
}




var simSpeed;

var playerlookup = {};
var playerlist = [];

var totalSims = 0;

var regions;
var careers;
var tribeData;

var mode = 'configure';

function preload() {
  //console.log("preloading");
  regions = loadJSON('data/regions.json');
  careers = loadJSON('data/careers.json');
  tribeData = loadJSON('data/tribes.json');
}

function setup() {
  // Initializing parse
  // Parse.initialize(
  //   '26LC5jbUOlEdJE279EcxTuMZskZBiOvlmrYia715',
  //   '46bI6Y2aMNXkCXeoYOJ5DnlLCCZsxWX6W9xmAEB8'
  // );
  noCanvas();

  // Loading a saved config?
  loadConfig();

  select('#once').mousePressed(runonce);
  select('#loopIt').mousePressed(loopIt);
  // select('#saveIt').mousePressed(sendToParse);

  select('#simulate').mousePressed(function () {
    if (mode === 'configure') {
      mode = 'simulate';
      select('#header').html('Run the simulation.');
      this.html('BACK TO CONFIGURE');
      select('#simulationDiv').show();
      select('#configureDiv').hide();
      populateTribes();
    } else {
      mode = 'configure';
      select('#header').html('Configure your cast.');
      this.html('SIMULATE');
      select('#simulationDiv').hide();
      select('#configureDiv').show();
    }
  });

  select('#hidetribeslink').mousePressed(function () {
    select('#hidetribes').hide();
    select('#showtribes').show();
    select('#tribe1').hide();
    select('#tribe2').hide();
  });

  select('#showtribeslink').mousePressed(function () {
    select('#showtribes').hide();
    select('#hidetribes').show();
    select('#tribe1').show();
    select('#tribe2').show();
  });
}
// function preload() {
// }

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
  populateTribes();
  simulate();
}

function populateTribes() {
  tribes = [];
  merged = false;
  state = 'immunity';
  winner = -1;
  loser = -1;
  week = 1;

  select('#simulation').show();
  select('#stats').show();

  var women = [];
  var men = [];
  for (var i = 0; i < 20; i++) {
    var gender = 'women';
    var num = i;
    if (i >= 10) {
      gender = 'men';
      num -= 10;
    }
    var name = select('#' + gender + '_' + num);
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

  // Known tribes
  for (var i = 0; i < women.length; i++) {
    if (women[i].tribe == 0) {
      tribe1.push(women[i]);
    } else {
      tribe2.push(women[i]);
    }
    if (men[i].tribe == 0) {
      tribe1.push(men[i]);
    } else {
      tribe2.push(men[i]);
    }
  }

  // For random tribes
  // for (var i = 0; i < 5; i++) {
  //   var pick1 = int(random(women.length));
  //   tribe1.push(women[pick1]);
  //   women.splice(pick1,1);

  //   var pick2 = int(random(men.length));
  //   tribe1.push(men[pick2]);
  //   men.splice(pick2,1);
  // }

  // for (var i = 0; i < women.length; i++) {
  //   tribe2.push(women[i]);
  //   tribe2.push(men[i]);
  // }

  tribes[0] = tribe1;
  tribes[1] = tribe2;
  showTribes();
  select('#tribe1name').html(tribeData[0].name);
  select('#tribe2name').html(tribeData[1].name);
}

function simulate() {
  totalSims++;
  go();
}

function go() {
  var statusDiv = select('#status');
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
      select('#tribe1name').html('Merge tribe');
      select('#tribe2name').html('Jury');
    } else {
      var tribeDivs = [];
      tribeDivs[0] = select('#tribe1');
      tribeDivs[1] = select('#tribe2');
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
        statusDiv.html('Tribe ' + (winner + 1) + ' wins immunity!');
      } else if (state === 'tribal') {
        var losingTribe = tribes[loser];
        var pick = voting(tribes[loser]);

        // TODO: break out being voted out to function
        var out = losingTribe[pick];
        out.placement = 21 - week;
        out.sumplace += out.placement;
        out.avgplace = out.sumplace / totalSims;
        week++;

        losingTribe.splice(pick, 1);
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
        tribecopy.splice(winner, 1);
        var out = voting(tribecopy);

        // TODO: break out being voted out to function
        var votedout = tribecopy[out];
        votedout.placement = 21 - week;
        votedout.sumplace += votedout.placement;
        votedout.avgplace = votedout.sumplace / totalSims;
        week++;

        tribecopy.splice(out, 1);
        tribes[0] = tribecopy;
        tribes[0].push(immune);
        statusDiv.html(votedout.name + ' voted out at tribal council!');
        tribes[1].push(votedout);
        state = 'immunity';
      }
    } else {
      if (state === 'final') {
        select('#tribe1name').html('Final Three');
        var soleSurvivor = votingWinner(tribes[0], tribes[1]);
        soleSurvivor.totalWins++;
        statusDiv.html('The sole survivor is ' + soleSurvivor.name + '!');
        state = 'gameover';
      } else {
        state = 'final';
        statusDiv.html('Tallying final tribal votes!');
      }
    }
  }
  showTribes();
  var wait = map(simSpeed, 1, 100, 1000, 0);
  // finished
  if (state === 'gameover') {
    if (looping) {
      // restarts the whole thing
      populateTribes();
      simulate();
    }
    // In all other scenarios, advance the game one week
  } else {
    setTimeout(go, wait);
  }
}

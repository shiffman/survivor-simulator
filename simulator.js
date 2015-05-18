function preload() {
  players = loadJSON('players.json');
}


function makeTable(gender) {
  for (var i = 0; i < 10; i++) {
    var row = createElement('tr');
    var nameCell = createElement('td');
    
    // <select>
    //   <option value="Stephen Fischbach">Stephen Fischbach</option> 
    // </select>
    var list = players.women;
    if (gender === 'men') {
      list = players.men;
    }


    // Who is the player?
    var sel = createElement('select');
    sel.id(gender+'_'+i);
    for (var j = 0; j < list.length; j++) {
      var player = list[(j+i)%list.length];
      var option = createElement('option',player.name);
      option.attribute('value',player.name);
      option.parent(sel);
    }
    sel.parent(nameCell);
    nameCell.parent(row);

    // Pre-merge challenge
    var slider = createSlider(1,10,5);
    var cell = createElement('td',slider.value());
    slider.parent(cell);
    cell.parent(row);
    slider.id('premerge_'+i);

    // Post-merge challenge
    var slider = createSlider(1,10,5);
    var cell = createElement('td',slider.value());
    slider.parent(cell);
    cell.parent(row);
    slider.id('postmerge_'+i);

    // Likeability
    var slider = createSlider(1,10,5);
    var cell = createElement('td',slider.value());
    slider.parent(cell);
    cell.parent(row);
    slider.id('like_'+i);


    if (gender === 'women') {
      row.parent('womenCastTableBody');
    } else {
      row.parent('menCastTableBody');
    }
  }
}

var simSpeed;

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
  }
  speedSlider.elt.oninput();

  makeTable('women');
  makeTable('men');
  getElement('once').mousePressed(simulate);

}


var tribes;
var merged;
var status;
var winner;
var loser;

function simulate() {
  tribes = [];
  merged = false;
  status = 'immunity';
  winner = -1;
  loser = -1;

  getElement('simulation').show();
  
  var women = [];
  var men = [];
  for (var i = 0; i < 20; i++) {
    var player = new Player();
    var gender = 'women';
    var num = i;
    if (i >= 10) {
      gender = 'men';
      num -= 10;
    }
    var name = getElement(gender + '_' + num);
    player.id = name.value();  // this should be a number
    player.name = name.value();
    player.premerge = getElement('premerge_' + num).value();
    player.postmerge = getElement('postmerge_' + num).value();
    player.like = getElement('like_' + num).value();
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

  
  go();
}

function showTribes() {

  var elts = getElements('playerlisting');
  for (var i = 0; i < elts.length; i++) {
    elts[i].remove();
  }

  for (var i = 0; i < tribes[0].length; i++) {
    createDiv(tribes[0][i].name).parent('tribe1').class('playerlisting');
  }
  for (var i = 0; i < tribes[1].length; i++) {
    createDiv(tribes[1][i].name).parent('tribe2').class('playerlisting');
  } 
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
      status = 'immunity';
      getElement('tribe1name').html("Merge tribe");
      getElement('tribe2name').html("Jury");
    } else {
      var tribeDivs = [];
      tribeDivs[0] = getElement('tribe1');
      tribeDivs[1] = getElement('tribe2');
      if (status === 'immunity') {
        winner = int(random(0,2));
        loser = 0;
        if (winner === 0) loser = 1;
        //tribeDivs[winner].style('background-color','#00FF00');
        //tribeDivs[loser].style('background-color','#FF0000');
        status = 'tribal';
        statusDiv.html('Tribe ' + (winner+1) + ' wins immunity!');
      } else if (status === 'tribal') {
        var tribe = tribes[loser];
        var pick = int(random(tribe.length));
        var votedout = tribe[pick];
        tribe.splice(pick,1);
        statusDiv.html(votedout.name + ' voted out at tribal council!');
        status = 'immunity';
      }
    }
  } else {
    var tribe = tribes[0];
    if (tribe.length > 3) {
      if (status === 'immunity') {
        winner = int(random(tribe.length));
        var immune = tribe[winner];
        status = 'tribal';
        statusDiv.html(immune.name + ' wins immunity!');
      } else if (status === 'tribal') {
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
        status = 'immunity';
      }
    } else {
      if (status === 'final') {
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
        status = 'gameover';
      } else {
        status = 'final';
        statusDiv.html("Tallying final tribal votes!");
      }
    }
  }
  showTribes();
  var wait = map(simSpeed,1,100,1000,10);
  if (!merged) {
    setTimeout(go,wait);
  } else if (status !== 'gameover') {
    setTimeout(go,wait);
  }
}


function Player() {

}




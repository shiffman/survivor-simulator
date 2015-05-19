function sendToParse() {
  var PlayerConfig = Parse.Object.extend("PlayerConfig");
  var config = new PlayerConfig();

  var data = {};
  data.men = [];
  data.women = [];
  
  var ids = {};
  for (var i = 0; i < 10; i++) {
    var wSel = getElement('women_'+i);
    var mSel = getElement('men_'+i);
    var w = playerlookup[wSel.value()];
    var m = playerlookup[mSel.value()];
    data.men.push(m);
    data.women.push(w);
    ids[wSel.value()] = true;
    ids[mSel.value()] = true;
  }
  for (var i = 0; i < playerlist.length; i++) {
    if (!ids[playerlist[i].id]) {
      if (playerlist[i].gender === 'female') {
        data.women.push(playerlist[i]);
      } else {
        data.men.push(playerlist[i]);
      }
    }
  }

  console.log(data);


  var id;
  config.save(data).then(function(result) {
    id = result.id;

    getElement('share').show();

    var linky = getElement('permalink');
    var url = 'http://shiffman.net/s-31-simulator/?id='+id;

    linky.html('<a href="' + url +'">' + url +'</a>');

    $('#twitterbutton').html('&nbsp;');
    var whattosay = "Here's my simulation of #Survivor Season 31!";
    $('#twitterbutton').html('<a href="https://twitter.com/share" class="twitter-share-button" data-url="' + url +'" data-size="default" data-via="srvrsimulator" data-text="' + whattosay + '" data-count="none">Tweet</a>');
    twttr.widgets.load();
    //console.log('http://shiffman.net/s-31-simulator/'+id);
  });
}


var players;

function loadConfig() {
  var params = getURLParams();
  var PlayerConfig = Parse.Object.extend("PlayerConfig");
  var query = new Parse.Query(PlayerConfig);
  
  var id = params.id;

  if (!id) {
    loadJSON('players.json', function(data) {
      players = data;
      startIt(true);
    });
  } else {
    // clean up params.id problem
    if (id.charAt(id.length-1) === '/') {
      id = id.substring(0, id.length - 1);
    }

    query.get(id, {
      success: function(config) {
        players = config._serverData;
        startIt(false);
      },
      error: function(object, error) {
        console.log('ooops', error);
        loadJSON('players.json', function(data) {
          players = data;
          startIt(true);
        });
      }
    });
  }
}


function startIt(randomize) {
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
  
  if (randomize) {
    players.men = shuffle(players.men);
    players.women = shuffle(players.women);
  }

  makeTable('women');
  makeTable('men');
}

// From: http://bost.ocks.org/mike/shuffle/
function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}
// var TestObject = Parse.Object.extend("TestObject");
// var testObject = new TestObject();
// testObject.save({foo: "bar"}).then(function(object) {
//   alert("yay! it worked");
// });
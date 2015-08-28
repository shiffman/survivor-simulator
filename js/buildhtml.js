
function makePlayerConfig(gender) {
  function updateCell(div, slider, prop) {
    return function() {
      // Update what the slider shows
      // and the actual player's stored value
      div.html(slider.value());
      slider.elt.linkedPlayer[prop] = slider.value();
    };
  }

  // function updateRow(gender, index) {
  //   return function() {
  //     var player = playerlookup[this.value];
  //     // we need to link the sliders in this row to this player
  //     var preSlider = getElement(gender+'_premerge_'+index);
  //     var postSlider = getElement(gender+'_postmerge_'+index);
  //     var likeSlider = getElement(gender+'_likeability_'+index);
  //     var threatSlider = getElement(gender+'_threat_'+index);
  //     var strategySlider = getElement(gender+'_strategicness_'+index);

  //     preSlider.elt.linkedPlayer = player;
  //     postSlider.elt.linkedPlayer = player;
  //     likeSlider.elt.linkedPlayer = player;
  //     threatSlider.elt.linkedPlayer = player;
  //     strategySlider.elt.linkedPlayer = player;
      
  //     // And reset their values
  //     preSlider.value(player.premerge);
  //     postSlider.value(player.postmerge);
  //     likeSlider.value(player.likeability);
  //     threatSlider.value(player.threat);
  //     strategySlider.value(player.strategicness);
      
  //     getElement(gender+'_premerge_'+index+'_txt').html(player.premerge);
  //     getElement(gender+'_postmerge_'+index+'_txt').html(player.postmerge);
  //     getElement(gender+'_likeability_'+index+'_txt').html(player.likeability);
  //     getElement(gender+'_threat_'+index+'_txt').html(player.threat);
  //     getElement(gender+'_strategicness_'+index+'_txt').html(player.strategicness);
  //   };
  // }

  function makeCell(player, row, label, num) {
    // Pre-merge challenge
    var slider = createSlider(1, 10, player[label]);
    var div = createDiv(slider.value());

    

    labels = [];
    labels.push('perceived threat level');
    labels.push('challenge skill (pre-merge)');
    labels.push('challenge skill (post-merge)');
    labels.push('general likeability');
    labels.push('strategy ability');

    var cell = createDiv(labels[num] + ": ");
    //cell.style('text-align','center');
    slider.parent(cell);
    slider.class('castslider');
    div.parent(cell);
    div.id(gender+ '_' + label + '_' +i+'_txt');
    div.class('slidernumber');
    slider.id(gender + '_' + label + '_'+i);
    slider.elt.oninput = updateCell(div, slider, label);
    // This is how we know which slider is attached to which player
    slider.elt.linkedPlayer = player;

    cell.parent(row);
  }

  var playersElt = select("#players");
  var list = players.women;
  if (gender === 'men') {
    list = players.men;
  }

  function newCareer() {
    this.player.career = this.value;
  }
  function newRegion() {
    this.player.region = this.value;
  }
  function newTribe() {
    this.player.tribe = this.value;
  }
  for (var i = 0; i < list.length; i++) {
    //var row = createElement('tr');
    //var nameCell = createElement('td');
    
    // <select>
    //   <option value="Stephen Fischbach">Stephen Fischbach</option> 
    // </select>

    // Who is the player?
    // Now just a div?

    var div = createDiv('');
    var h4 = createElement('h4',list[i].name);
    h4.parent(div);
    // div.style("font-size", "94%");
    div.parent(playersElt);
    div.id(gender+'_'+i);
    div.value(list[i].id);
    div.class("player");
    //nameCell.parent(row);
    
    makeCell(list[i], div, 'premerge',0);
    makeCell(list[i], div, 'postmerge',1);
    makeCell(list[i], div, 'likeability',2);
    makeCell(list[i], div, 'threat',3);
    makeCell(list[i], div, 'strategicness',4);


    var dropDiv = createDiv('career: ');
    var dropdown = createSelect();
    for (var j = 0; j < careers.length; j++) {
      dropdown.option(careers[j].career, careers[j].id);
    }
    // Set what it starts as
    dropdown.value(list[i].career);
    dropdown.parent(dropDiv);
    dropDiv.parent(div);
    dropdown.elt.player = list[i];
    dropdown.elt.onchange = newCareer;

    var dropDiv = createDiv('region: ');
    var dropdown = createSelect();
    for (var j = 0; j < regions.length; j++) {
      dropdown.option(regions[j].region, regions[j].id);
    }
    // Set what it starts as
    dropdown.value(list[i].region);
    dropdown.parent(dropDiv);
    dropDiv.parent(div);
    dropdown.elt.player = list[i];
    dropdown.elt.onchange = newRegion;

    var dropDiv = createDiv('tribe: ');
    var dropdown = createSelect();
    for (var j = 0; j < tribeData.length; j++) {
      dropdown.option(tribeData[j].name, tribeData[j].id);
    }
    // Set what it starts as
    dropdown.value(list[i].tribe);
    // console.log(list[i].name);
    // console.log(list[i].tribe);
    dropdown.parent(dropDiv);
    dropDiv.parent(div);
    dropdown.elt.player = list[i];
    dropdown.elt.onchange = newTribe;


    var allies = createDiv('');
    allies.parent(div);
    var addAlly = createButton('add likely ally');
    var comingsoon = createDiv('  coming soon');
    comingsoon.style('color','#FFF');
    comingsoon.style('display','inline');

    addAlly.parent(allies);
    comingsoon.parent(allies);
    addAlly.mousePressed(makeAlly(list[i], allies, comingsoon));

    // if (gender === 'women') {
    //   row.parent('womenCastTableBody');
    // } else {
    //   row.parent('menCastTableBody');
    // }
  }

  function makeAlly(player, div, comingsoon) {
    return function() {
      comingsoon.style('color','#000');
    }
  }

}


function showTribes() {

  var elts = selectAll('.playerlisting');
  for (var i = 0; i < elts.length; i++) {
    elts[i].remove();
  }

  for (i = 0; i < tribes[0].length; i++) {
    createDiv(tribes[0][i].name).parent('tribe1').class('playerlisting');
  }
  for (i = 0; i < tribes[1].length; i++) {
    createDiv(tribes[1][i].name).parent('tribe2').class('playerlisting');
  }

  for (i = 0; i < playerlist.length; i++) {
    playerlist[i].position = i;
  }
  
  // // by total wins
  // playerlist.sort(function(a, b) {
  //   if (b.totalWins === a.totalWins) {
  //     return a.position - b.position;
  //   } else {
  //     return b.totalWins - a.totalWins;
  //   }
  // });

  // by avg finish
  playerlist.sort(function(a, b) {
    if (b.avgplace === a.avgplace) {
      return a.position - b.position;
    } else {
      return a.avgplace - b.avgplace;
    }
  });
  
  for (i = 0; i < playerlist.length; i++) {
    var player = playerlist[i];
    if (player.playing) {
      var row = createElement('tr');
      row.parent('statsTable');
      row.class('playerlisting');
      createElement('td',player.name).parent(row);
      createElement('td',player.totalWins).parent(row);
      createElement('td',player.avgplace.toFixed(2)).parent(row);

      var mergeFreq = 100 * player.merges / totalSims;
      createElement('td',mergeFreq.toFixed(2) + '%').parent(row);

      createElement('td',player.immunities).parent(row);
      createElement('td',player.teamWins).parent(row);
    }
  }


}
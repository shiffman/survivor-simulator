
function makeTable(gender) {
  function updateCell(div, slider, prop) {
    return function() {
      // Update what the slider shows
      // and the actual player's stored value
      div.html(slider.value());
      slider.elt.linkedPlayer[prop] = slider.value();
    };
  }

  function updateRow(gender, index) {
    return function() {
      var player = playerlookup[this.value];
      // we need to link the sliders in this row to this player
      var preSlider = getElement(gender+'_premerge_'+index);
      var postSlider = getElement(gender+'_postmerge_'+index);
      var likeSlider = getElement(gender+'_likeability_'+index);
      var threatSlider = getElement(gender+'_threat_'+index);
      var strategySlider = getElement(gender+'_strategicness_'+index);

      preSlider.elt.linkedPlayer = player;
      postSlider.elt.linkedPlayer = player;
      likeSlider.elt.linkedPlayer = player;
      threatSlider.elt.linkedPlayer = player;
      strategySlider.elt.linkedPlayer = player;
      
      // And reset their values
      preSlider.value(player.premerge);
      postSlider.value(player.postmerge);
      likeSlider.value(player.likeability);
      threatSlider.value(player.threat);
      strategySlider.value(player.strategicness);
      
      getElement(gender+'_premerge_'+index+'_txt').html(player.premerge);
      getElement(gender+'_postmerge_'+index+'_txt').html(player.postmerge);
      getElement(gender+'_likeability_'+index+'_txt').html(player.likeability);
      getElement(gender+'_threat_'+index+'_txt').html(player.threat);
      getElement(gender+'_strategicness_'+index+'_txt').html(player.strategicness);
    };
  }

  function makeCell(player, row, label) {
    // Pre-merge challenge
    var slider = createSlider(1, 10, player[label]);
    var div = createDiv(slider.value());
    var cell = createElement('td');
    //cell.style('text-align','center');
    slider.parent(cell);
    slider.class('castslider');
    div.parent(cell);
    cell.parent(row);
    div.id(gender+ '_' + label + '_' +i+'_txt');
    div.class('slidernumber');
    slider.id(gender + '_' + label + '_'+i);
    slider.elt.oninput = updateCell(div, slider, label);
    // This is how we know which slider is attached to which player
    slider.elt.linkedPlayer = player;
  }

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
      option.attribute('value',player.id);
      option.parent(sel);
      sel.elt.onchange = updateRow(gender, i);
    }
    sel.parent(nameCell);
    nameCell.parent(row);
    
    makeCell(list[i], row, 'premerge');
    makeCell(list[i], row, 'postmerge');
    makeCell(list[i], row, 'likeability');
    makeCell(list[i], row, 'threat');
    makeCell(list[i], row, 'strategicness');

    // Post-merge challenge
    // slider = createSlider(1,10, player.postmerge);
    // div = createDiv(slider.value());
    // slider.class('castslider');
    // div.class('slidernumber');
    // cell = createElement('td');
    // //cell.style('text-align','center');
    // slider.parent(cell);
    // div.parent(cell);
    // div.id(gender+'_postmerge_'+i+'_txt');
    // cell.parent(row);
    // slider.id(gender+'_postmerge_'+i);
    // slider.elt.oninput = updateCell(div, slider, 'postmerge');
    // slider.elt.linkedPlayer = player;

    // // Likeability
    // slider = createSlider(1,10,player.likeability);
    // slider.class('castslider');
    // div = createDiv(slider.value());
    // div.class('slidernumber');
    // cell = createElement('td');
    // slider.parent(cell);
    // div.parent(cell);
    // cell.parent(row);
    // div.id(gender+'_like_'+i+'_txt');
    // slider.id(gender+'_like_'+i);
    // slider.elt.oninput = updateCell(div, slider, 'likeability');
    // slider.elt.linkedPlayer = player;


    if (gender === 'women') {
      row.parent('womenCastTableBody');
    } else {
      row.parent('menCastTableBody');
    }
  }
}

function showTribes() {

  var elts = getElements('playerlisting');
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
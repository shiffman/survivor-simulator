
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
      var likeSlider = getElement(gender+'_like_'+index);
      preSlider.elt.linkedPlayer = player;
      postSlider.elt.linkedPlayer = player;
      likeSlider.elt.linkedPlayer = player;
      // And reset their values
      preSlider.value(player.premerge);
      postSlider.value(player.postmerge);
      likeSlider.value(player.likeability);

      getElement(gender+'_premerge_'+index+'_txt').value(player.premerge);
      getElement(gender+'_postmerge_'+index+'_txt').value(player.premerge);
      getElement(gender+'_like_'+index+'_txt').value(player.premerge);
    };
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

    // Pre-merge challenge
    var player = list[i];
    var slider = createSlider(1, 10, player.premerge);
    var div = createDiv(slider.value());
    var cell = createElement('td');
    slider.parent(cell);
    div.parent(cell);
    cell.parent(row);
    div.id(gender+'_premerge_'+i+'_txt');
    slider.id(gender+'_premerge_'+i);
    slider.elt.oninput = updateCell(div, slider, 'premerge');
    // This is how we know which slider is attached to which player
    slider.elt.linkedPlayer = player;

    // Post-merge challenge
    slider = createSlider(1,10,player.postmerge);
    div = createDiv(slider.value());
    cell = createElement('td');
    slider.parent(cell);
    div.parent(cell);
    div.id(gender+'_postmerge_'+i+'_txt');
    cell.parent(row);
    slider.id(gender+'_postmerge_'+i);
    slider.elt.oninput = updateCell(div, slider, 'postmerge');
    slider.elt.linkedPlayer = player;

    // Likeability
    slider = createSlider(1,10,player.likeability);
    div = createDiv(slider.value());
    cell = createElement('td');
    slider.parent(cell);
    div.parent(cell);
    cell.parent(row);
    div.id(gender+'_like_'+i+'_txt');
    slider.id(gender+'_like_'+i);
    slider.elt.oninput = updateCell(div, slider, 'likeability');
    slider.elt.linkedPlayer = player;


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

  for (var i = 0; i < tribes[0].length; i++) {
    createDiv(tribes[0][i].name).parent('tribe1').class('playerlisting');
  }
  for (var i = 0; i < tribes[1].length; i++) {
    createDiv(tribes[1][i].name).parent('tribe2').class('playerlisting');
  }
}
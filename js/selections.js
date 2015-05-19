
function voting(tribe) {
  // A coin flip right now
  return int(random(tribe.length));
}


function votingWinner(finalthree, jury) {
  // Start with 0 votes
  for (var i = 0; i < finalthree.length; i++) {
    finalthree[i].voteCount = 0;
  }
  // The jury randomly votes
  // TODO: add probability/logic
  for (i = 0; i < jury.length; i++) {
    var vote = int(random(3));
    finalthree[vote].voteCount++;
  }

  // Who has the most votes?
  // TODO: deal with ties
  var soleSurvivor = finalthree[0];
  for (i = 1; i < finalthree.length; i++) {
    if (finalthree.voteCount > soleSurvivor.voteCount) {
      soleSurvivor = finalthree[i];
    }
  }
  return soleSurvivor;
}

function individualImmunity(tribe) {
  // Who wins individual immunity?
  // higher the challenge rating, more chances to win
  // TODO: map score to probability exponentially?
  var choices = [];
  for (var i = 0; i < tribe.length; i++) {
    var score = tribe[i].postmerge;
    for (var j = 0; j < score; j++) {
      choices.push(i);
    }
  }
  return choices[int(random(choices.length))];
}

function tribalImmunity(tribes) {  
  // Which tribe will win immunity?
  var total = min(tribes[0].length, tribes[1].length);
  
  // sort by challenge skills and use the top players
  // assume lowest rated players will sit out
  tribes[0].sort(function(a,b) {
    return b.premerge-a.premerge;
  });

  tribes[1].sort(function(a,b) {
    return b.premerge-a.premerge;
  });

  // TODO: map score to probability exponentially?
  var score0 = 0;
  var score1 = 0;
  for (var i = 0; i < total; i++) {
    score0 += tribes[0][i].premerge;
    score1 += tribes[1][i].premerge;
  }
  var choices = [];
  for (i = 0; i < score0; i++) {
    choices.push(0);
  }
  for (i = 0; i < score1; i++) {
    choices.push(1);
  }
  return choices[int(random(0,choices.length))];
}

function voting(tribe, merged) {
  
  var choices = [];
  if (!merged) {
    for (var i = 0; i < tribe.length; i++) {
      var player = tribe[i];
      // Less chance of being voted out if you are good at challenges
      for (var n = 0; n < 10-player.premerge; n++) {
        choices.push(i);
      }
      // Less chance of being voted out if you are likeable
      for (n = 0; n < 10-player.likeability; n++) {
        choices.push(i);
      }
      // More chance of being voted out if you are perceived as threat to win
      for (n = 0; n < player.threat; n++) {
        choices.push(i);
      }
      // Less chance of being voted out if you are good at strategy
      for (n = 0; n < 10-player.strategicness; n++) {
        choices.push(i);
      }
    }
  } else {
    for (var i = 0; i < tribe.length; i++) {
      var player = tribe[i];

      // A lot more chance of being voted out if you are good at challenges
      var exp = Math.pow(player.postmerge, 2);
      for (var n = 0; n < exp; n++) {
        choices.push(i);
      }

      // A lot more chance of being voted out if you are perceived as a threat
      var exp = Math.pow(player.threat, 2);
      for (var n = 0; n < exp; n++) {
        choices.push(i);
      }

      // When there are 6 or more
      if (tribe.length > 6) {
        // Less chance of being voted out if you are likeable
        for (n = 0; n < 10-player.likeability; n++) {
          choices.push(i);
        }
      } else {
        // More chance of being voted out if you are likeable
        for (n = 0; n < player.likeability; n++) {
          choices.push(i);
        }
      }
      
      // Less chance of being voted out if you are good at strategy
      for (n = 0; n < 10-player.strategicness; n++) {
        choices.push(i);
      }
    }
  }
  return choices[int(random(choices.length))];
}


function votingWinner(finalthree, jury) {
  // Start with 0 votes
  var choices = [];
  for (var i = 0; i < finalthree.length; i++) {
    finalthree[i].voteCount = 0;
    // More chances to be voted for the more likeable you are
    for (var n = 0; n < finalthree[i].likeability; n++) {
      choices.push(i);
    }
    // More chances to be voted for the more strategic you are
    for (var n = 0; n < finalthree[i].strategicness; n++) {
      choices.push(i);
    }
  }

  // Vote
  for (i = 0; i < jury.length; i++) {
    var vote = choices[int(random(choices.length))];
    finalthree[vote].voteCount++;
  }

  // Sort by votes
  finalthree.sort(function(a,b) {
    return b.voteCount - a.voteCount;
  });
  
  // Winner and placement
  var soleSurvivor = finalthree[0];
  soleSurvivor.placement = 1;
  finalthree[1].placement = 2;
  finalthree[2].placement = 3;

  for (i = 0; i < finalthree.length; i++) {
    finalthree[i].sumplace += finalthree[i].placement;
    finalthree[i].avgplace = finalthree[i].sumplace / totalSims;
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
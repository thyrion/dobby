// dice rolling plugin


exports.help = [
    ['.roll <dice>',
     'Rolls dice and adds them for you, e.g. .roll 3d6, .roll 10w4+10'],
    ['.sr <dice>',
     'Rolls d6 and counts hits for you, e.g. .sr 12'],
    ['.attack',
      'Rolls default d20 attack for D&D or The Black Eye']
]

exports.onMessage = function(msg, dobby) {

    var split = /\.(\S+)(\s(\S+))?/.exec(msg);

    if(split && /roll|würfeln|attack|angriff|sr/.find(split[1])){
      var diceObj = parseDice(split[3]);
      if(diceObj){
        var dice = [],
            result = '',
            resolver;

        switch(split[1]) {
          case 'roll':
          case 'würfeln':
            result = 'result: ';
            resolver = addUp;
            break;
          case 'attack':
          case 'angriff':
            result = 'result: ';
            resolver = addUp;
            diceObj.count = 1;
            diceObj.dietype = 20;
            break;
          case 'sr':
            result = 'hits: ';
            resolver = countHits;
            diceObj.dietype = 6;
            diceObj.modifier = 5;
            break;
          default:
            return true;
        }
        dice = rollDice(diceObj.count, diceObj.dietype);
        result += resolver(dice, diceObj.modifier);
        dobby.respond('\n' + result + '\n\n' + dice.join(' ') + '\n');
      }
      else{
        dobby.respond('Dobby couldn\'t find sane dice ;(');
      }
    }
    else{
      dobby.respond('Dobby didn\'t understand master at all oO');
    }
}

function parseDice(diceTxt){
  var res = /\D*([0-9]+)([dwDW](\d{1,3})(\+(\d+))?)?/.exec(diceTxt);
  var result;
  if(res) {
    result = {
      count: res[1] || 0,
      dietype: res[3] || 0,
      modifier: res[5] || 0
    };
  }
  return result;
}

function rollDice(count, dietype){
  var dice = [];
  for(var i = 0; i < count; i++){
      dice.push(Math.floor(Math.random() * dietype) + 1);
  }
  return dice.length? dice : [0];
}

function countHits(dice, countsAsHit){
  var hits = 0;
  for(var i=0; i<dice.length; i++){
    if(dice[i] >= countsAsHit) hits++;
  }
  return hits;
}

function addUp(dice, modifier){
  var result = 0;
  modifier = parseInt(modifier) || 0;
  result = modifier + dice.reduce(function(a,b){return a+b;});
  return result;
}

function max(dice){
  return Math.max.apply(null, dice);
}

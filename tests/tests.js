QUnit.module("GameTesting", {
    setup: function() {
        this.game = new RockPaper();
    }
});

QUnit.test("Scissors loses to rock", function(assert) {
  var result = [], prop, i;
  for (prop in this.moves) {
    if (this.game.moves.hasOwnProperty.call(this.moves, prop)) {
      result.push(prop);
    }
  }
  var resultLength = result.length;
  assert.deepEqual(resultLength, 3, "Length of moves should be equal to 3");
});

QUnit.test("Rock loses to paper", function(assert) {
    var result = this.game.compareMoves("rock", "paper");
    assert.deepEqual(result, 'player2', "Rock should lose to paper");
});

QUnit.test("Paper loses to scissors", function(assert) {
    var result = this.game.compareMoves("paper", "scissors");
    assert.deepEqual(result, 'player2', "Paper should lose to scissors");
});

QUnit.test("Scissors loses to rock", function(assert) {
    var result = this.game.compareMoves("scissors", "rock");
    assert.deepEqual(result, 'player2', "Scissors should lose to rock");
});

QUnit.test("Rock draws with rock", function(assert) {
    var outcome = this.game.compareMoves("rock", "rock");
    assert.deepEqual(outcome, 'draw', "Rock should draw with rock");
});

QUnit.test("Paper draws with paper", function(assert) {
    var outcome = this.game.compareMoves("paper", "paper");
    assert.deepEqual(outcome, 'draw', "Paper should draw with paper");
});

QUnit.test("Scissors draws with scissors", function(assert) {
    var outcome = this.game.compareMoves("scissors", "scissors");
    assert.deepEqual(outcome, 'draw', "Scissors should draw with scissors");
});

QUnit.test("Rock wins against scissors", function(assert) {
    var outcome = this.game.compareMoves("rock", "scissors");
    assert.deepEqual(outcome, 'player1', "Rock should beat scissors");
});

QUnit.test("Paper wins against rock", function(assert) {
    var outcome = this.game.compareMoves("paper", "rock");
    assert.deepEqual(outcome, 'player1', "Paper should beat rock");
});

QUnit.test("Scissors wins against paper", function(assert) {
    var outcome = this.game.compareMoves("scissors", "paper");
    assert.deepEqual(outcome, 'player1', "Scissors should beat paper");
});


QUnit.test("If a 'best of 3', a player will need to win 2 rounds to win the game", function(assert) {
    var gameLength = 3;
    this.game.bestOfScore = Math.ceil(gameLength / 2);
    var outcome = this.game.bestOfScore;
    assert.deepEqual(outcome, 2, "Must win 2 rounds to win");
});


QUnit.test("If a 'best of 7', a player will need to win 2 rounds to win the game", function(assert) {
    var gameLength = 7;
    this.game.bestOfScore = Math.ceil(gameLength / 2);
    var outcome = this.game.bestOfScore;
    assert.deepEqual(outcome, 4, "Must win 4 rounds to win");
});

QUnit.test("Having an even number of best of will send back error", function(assert) {
   var outcome = this.game.getInfo(4);
    assert.deepEqual(outcome, 'error', "Should return error");
});


QUnit.test("Score should equal 1", function(assert) {
    var outcome = this.game.compareMoves("rock", "scissors");
    var score = this.game.amendScore('player1');
    assert.deepEqual(this.game.player1.score, 1, "Should return 1");
});
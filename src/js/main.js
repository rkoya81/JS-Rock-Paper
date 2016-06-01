

/*
	Create a constructor for the application  containing the moves available.
*/
function RockPaper () {
	this.moves = {
		rock: {
      losesTo: "scissors"
    },
    paper: {
       losesTo: "rock"
    },
    scissors: {
       losesTo: "paper"
    }
  };

	this.init();
}

/*
  Get the length of the best of value and call the method getInfo and reset method
*/
RockPaper.prototype.init = function() {
	var gameLength = document.getElementById("best-of").value;
	this.getInfo(gameLength);
	this.reset();
};

/*
  Checks the best of value is an odd value if not an error is thrown. If it is an odd number then the players will get
  created by calling the create players method based on radio button that is selected. 
*/
RockPaper.prototype.getInfo = function(gameLength) {
	var player = document.querySelector('input[name="player"]:checked').value;
	if(gameLength % 2 !== 1) {
		this.displayErrorMessage();
		return 'error';
	} else {
		$('#best-error').removeClass('show');
		this.bestOfScore = Math.ceil(gameLength / 2);
		this.createPlayers(player);
		document.getElementById('gameControlsForm').style.display = 'block';
		document.getElementsByClassName('rock-paper-form')[0].style.display = 'none';
	}
};

/*
  Displays the error for best of value. 
*/
RockPaper.prototype.displayErrorMessage = function() {
	var elem = document.getElementById('best-error');
	elem.innerHTML = "Best of value must be an odd number";
	$('#best-error').addClass('show');
};

/*
  Players are created based on selected radio button. If both players are CPU then we play the game automatically and 
  a selection of the move is made every 2 seconds until a winner is found. Call the Player constructor if it is Person vs CPU 
  else call CPUPlayer twice.
*/
RockPaper.prototype.createPlayers = function(player) {
	if(player === 'person') {
		this.player1 = new Player(this);
	} else if (player === 'cpu') {
		this.player1 = new CPUPlayer(this);
	}
	this.player2 = new CPUPlayer(this);
	
	if(this.player1.playerType === 'cpu' && this.player2.playerType === 'cpu') {
		var i = 0;
		var that = this;
    var runGame = setInterval(function() { 
      if(that.player1.score < that.bestOfScore && that.player2.score < that.bestOfScore) {
          i++;
         that.playGame('cpu');
      } else {
      	clearInterval(runGame);
      }
    }, 2000);
	}
};

/*
  Play the game, takes the elem argument which contains the id of the element click if Person else it will have a value of cpu 
  if Player 1 is a cpu. We add a message to the dom based on who won by comparing the moves 
	and call the amend score method.
*/
RockPaper.prototype.playGame = function(elem) {
	if(elem === 'cpu') {
		document.getElementById("gameControlsForm").style.display = 'block';
		this.player1.moveMade = this.player2.play();
		$('#gameControlsForm li').removeClass('selected');
		$('.moves #' + this.player1.moveMade).addClass('selected');
	} else {
		this.player1.moveMade = elem[0].id;
	}

	this.player2.moveMade = this.player2.play();

	$('.robot-moves li').hide();
	$('#' + this.player2.moveMade, '.robot-moves').show();

	var results = this.compareMoves(this.player1.moveMade, this.player2.moveMade);

	switch(results) {
    case 'player1':
     	this.player1.game.amendScore('player1');
     	message = "Player 1 played " + this.player1.moveMade +
      					", Player 2 played " + this.player2.moveMade  + 
      					", therefore <strong>Player 1 wins this round.</strong>";
    break;
    case 'player2':
     	this.player2.game.amendScore('player2');
     	message = "Player 1 played " + this.player1.moveMade +
      					", Player 2 played " + this.player2.moveMade  + 
      					", therefore <strong>Player 2 wins this round.</strong>";
        
    break;
    case 'draw':
     	message = "It's a draw.";
    break;
    default:
  }
  document.getElementById('round-winner').innerHTML = message;
};

/*
	Method to compare the moves made by each player, and determine if there is a winner or if it is a draw
*/
RockPaper.prototype.compareMoves = function(move1, move2) {
	if(move1 in this.moves && move2 in this.moves) {
		if (this.moves[move1].losesTo === move2) {
      return 'player1';
    }

		if (this.moves[move2].losesTo === move1) {
      return 'player2';
    }

    return 'draw';
	}
};

/*
  Amend the players score based on the winner of the round. Also check if there is a winner to stop the game.
*/
RockPaper.prototype.amendScore = function(playerType) {
	if(playerType === 'player1') {
		this.player1.score += 1;
		document.getElementById('player-1').children[0].childNodes[0].nodeValue = this.player1.score;
	} else {
		this.player2.score += 1;
		document.getElementById('player-2').children[0].childNodes[0].nodeValue = this.player2.score;
	}
	this.isThereAWinner();
};

/* 
  Check for a winner. If a winner is found the we update the winner message in the dom and hide all other game options
*/
RockPaper.prototype.isThereAWinner = function() {
	var message = '';
	if(this.player1.score === this.bestOfScore) {
	 	message = 'Player 1 wins the game.';
	} else if(this.player2.score === this.bestOfScore) {
	 	message = 'Player 2 wins the game.';
	}

	if(message !== '') {
	 	document.getElementById("winner-container").style.display = 'block';
	 	document.getElementById("winner-msg").innerHTML = message;
 		document.getElementById('round-winner').style.display = 'none';
 		document.getElementById('gameControlsForm').style.display = 'none';
 	}
};

/* 
  Reset all game option on click of the reset button.
*/
RockPaper.prototype.reset = function() {
	var that = this;
	$('.reset').on('click', function () {
		$('#gameControlsForm li').removeClass('selected');

		document.getElementsByClassName('rock-paper-form')[0].style.display = 'block';
		document.getElementById('gameControlsForm').style.display = 'none';
		document.getElementById("winner-container").style.display = 'none';
 		document.getElementById('round-winner').style.display = 'block';
 		document.getElementById('round-winner').innerHTML = '';
		document.getElementById("winner-msg").innerHTML = '';
		document.getElementById('player-1').children[0].childNodes[0].nodeValue = 0;
		document.getElementById('player-2').children[0].childNodes[0].nodeValue = 0;
		that.player1.score = 0;
		that.player2.score = 0;
	});
};

/* 
	Set the player with their own options and apply the click event handler to the options in the list item in the HTML
*/

function Player (game) {
	this.game = game;
  this.moves = game.moves;
  this.moveMade = '';
  this.score = 0;
  this.playerType = 'person';

  var that = this;
	document.getElementById("gameControlsForm").style.display = 'block';
	$('#gameControlsForm .moves').on('click', 'li', function () {
		$('#gameControlsForm li').removeClass('selected');
		$(this).addClass('selected');
		that.game.playGame($(this));
	});	
}

/* 
	Set the CPU player with their own options.
*/
function CPUPlayer(game) {
	this.game = game;
  this.moves = game.moves;
  this.moveMade = '';
  this.score = 0;
  this.playerType = 'cpu';
}

/* 
	Method to select a random value based on length of moves available. 
*/
CPUPlayer.prototype.play = function () {
	var keys = Object.keys(this.moves);
  moves = Math.floor(Math.random() * keys.length);
  this.moveMade = keys[moves];
  return this.moveMade;
};
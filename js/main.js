var mouseDownInterval, drawnCards, score, suits, cardValues, choice, gameIsActive;

/*
Continuously move the cards container to the right (if it can) whilst the left mouse button is held down on the right arrow element.
 */
document.getElementById('right-arrow').addEventListener('mousedown', function(e) {
    mouseDownInterval = setInterval(moveCardsContainerRight, 100);
});

/*
Continuously move the cards container to the left (if it can) whilst the left mouse button is held down on the left arrow element.
 */
document.getElementById('left-arrow').addEventListener('mousedown', function(e) {
    mouseDownInterval = setInterval(moveCardsContainerLeft, 100);
});

/*
Stop the cards container from moving when the mouse button is unpressed.
 */
document.addEventListener('mouseup', function() {
    if (mouseDownInterval) {
        clearInterval(mouseDownInterval);
    }
});


/*
Move the cards container to the right if it can.
@param none
@return void
 */
function moveCardsContainerRight() {
    if (cardsContainerCanMoveRight()) {
        var currentRightcardValue = Math.abs(document.getElementById('cards-container').offsetLeft);
        var nextRightcardValue = currentRightcardValue + 4;

        document.getElementById('cards-container').style.right = nextRightcardValue + "px";

        /*
        Display/hide the arrow buttons based on the new cards container position.
         */
        updateArrowButtonVisibility(nextRightcardValue);
    }
}

/*
Move the cards container to the left if it can.
@param none
@return void
 */
function moveCardsContainerLeft() {
    if (cardsContainerCanMoveLeft()) {
        var currentRightcardValue = Math.abs(document.getElementById('cards-container').offsetLeft);
        var nextRightcardValue = currentRightcardValue - 4;

        document.getElementById('cards-container').style.right = nextRightcardValue + "px";

        /*
        Display/hide the arrow buttons based on the new cards container position.
         */
        updateArrowButtonVisibility(nextRightcardValue);
    }
}

/*
Determine whether the cards container element can move any further to the right.
@param none
@return boolean - The answer to whether the element can move.
 */
function cardsContainerCanMoveRight() {
    var fullContainerWidth = document.getElementById('cards-container').scrollWidth;
    var visibleContainerWidth = document.getElementById('cards-container').clientWidth;
    var displacement = document.getElementById('cards-container').offsetLeft;
    var offset = 7; // The offset that's required to push the last card further away from the edge of the playing area

    /* If the difference between the full container width and the displacement (to the right) is greater than or equal to the visible container width return true */
    if (fullContainerWidth + displacement >= visibleContainerWidth - offset) {
        return true;
    } else {
        return false;
    }
}

/*
Determine whether the cards container element can move any further to the left.
@param none
@return boolean - the answer to whether the element can move.
 */
function cardsContainerCanMoveLeft() {
    var displacement = document.getElementById('cards-container').offsetLeft;

    if (displacement < 0) { // The left offset cannot be less than the starting cardValue.
        return true;
    } else {
        return false;
    }
}

/*
Update the visibility of the left and right arrow buttons on the DOM, based on the current position of the cards container element relative to the play-area element.

@param number cardsContainerRightVal - The current position of the cards container element, relative to the play-area element.
@return void.
 */
function updateArrowButtonVisibility(cardsContainerRightVal) {
    var fullContainerWidth = document.getElementById('cards-container').scrollWidth;
    var visibleContainerWidth = document.getElementById('cards-container').clientWidth;
    var offset = 7;
    var maxRightVal = fullContainerWidth - visibleContainerWidth;
    var minRightVal = 0;

    /*
    If the cards container right value is equal to or less than the starting value, plus if the cards are overflowing the cards container.
    (Less than or equal as the position can exceed the minimum boundary due to moving several pixels per iteration.)
     */
    if (cardsContainerRightVal <= minRightVal && fullContainerWidth > visibleContainerWidth) {
        hideLeftArrowContainer();
        showRightArrowContainer();
    }

    /*
    If the cards container right value is equal to or less than the starting value, plus if the cards aren't overflowing the cards container.
     */
    else if (cardsContainerRightVal <= minRightVal && fullContainerWidth <= visibleContainerWidth) {
        hideLeftArrowContainer();
        hideRightArrowContainer();
    }

    /*
    If the cards container right value is equal to or greater than the difference between the total length of the cards container (plus the offset) - the visible part.
    (Greater than or equal as the position can exceed the maximum boundary due to moving several pixels per iteration.)
    */
    else if (cardsContainerRightVal >= maxRightVal + offset) {
        hideRightArrowContainer();
        showLeftArrowContainer();
    }

    else {
        showLeftArrowContainer();
        showRightArrowContainer();
    }
}

/*
Show the left arrow container on the DOM.

@param none.
@return void.
 */
function showLeftArrowContainer() {
    document.getElementById('left-arrow-container').style.display = "block";
}

/*
Show the right arrow container on the DOM.

@param none.
@return void.
 */
function showRightArrowContainer() {
    document.getElementById('right-arrow-container').style.display = "block";
}

/*
Hide the left arrow container on the DOM.

@param none.
@return void.
 */
function hideLeftArrowContainer() {
    document.getElementById('left-arrow-container').style.display = "none";
}

/*
Hide the right arrow container on the DOM.

@param none.
@return void.
 */
function hideRightArrowContainer() {
    document.getElementById('right-arrow-container').style.display = "none";
}

/*
Update the DOM and run the initiator function when the new game button is clicked.
 */
document.getElementById('new-game').addEventListener('click', function() {
    document.querySelector('.game-message').textContent = '';
   document.getElementById('new-game').classList.add('clicked');
   document.getElementById('shaded-area').classList.add('inactive');
   document.getElementById('game-score-container').classList.add('game-started');
    document.getElementById('hi-lo-btn-container').classList.add('game-started');
    document.getElementById('play-area').classList.add('game-started');
    document.getElementById('cards-container').style.right = '0px';
    setTimeout(function() { // Allow for the DOM to redraw before updating the arrow button visibility.
        updateArrowButtonVisibility(0);
    }, 50);

    init();
});

/*
Initialise the main game variables, clear the cards container content and set the game-score HTML text content to 0 before drawing a card.
 */
function init() {
    drawnCards = [];
    score = 0;
    suits = ['Spades', 'Clubs', 'Hearts', 'Diamonds'];
    cardValues = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
    gameIsActive = true;

    document.getElementById('cards-container').innerHTML = '';
    document.getElementById('game-score').textContent = '0';

    drawCard();
}

/*
Draw a card that hasn't already been drawn out of the deck, update the DOM to show the new card and check to see if the player has won.

@param none.
@return void.
 */
function drawCard() {
    var suit = suits[Math.floor(Math.random() * 4)]; // Random number between 0-3.
    var value = Math.floor(Math.random() * 13); // Random number between 0-12.

    while (cardAlreadyDrawn(suit, value)) {
        suit = suits[Math.floor(Math.random() * 4)];
        value = Math.floor(Math.random() * 13);
    }

    drawnCards.push([suit, value]);

    var cardValue = cardValues[value]; // Required as some of the card values aren't simply just a number (Jack, Queen, King Ace).
    document.getElementById('cards-container').innerHTML += '<img class="card" src="./img/' + cardValue + '_' + suit + '.png"/>';

    // A timeout of 50ms is set before the scrollToLatestCard function is called so that the DOM can re-draw before the code is executed.
    setTimeout(scrollToLatestCard, 50);
}

/*
Check to see if a card has already been drawn from the deck.

@param String suit - The suit of the card to verify.
@param Number value - the number value of the card to verify.

@return Boolean - Returns true if the card to verify has already been drawn.
 */
function cardAlreadyDrawn(suit, value) {
    var cardFound = false;

    for (var i =0; i < drawnCards.length; i++) {
        if (drawnCards[i][0] === suit && drawnCards[i][1] === value) {
            cardFound = true;
            break;
        } else {
            cardFound = false;
        }
    }

    return cardFound;
}

/*
Draw a card then either run the gameOver function or updateScore, depending on whether the next card is higher or lower than the previous card.
 */
document.getElementById('high').addEventListener('click', function() {
    if (gameIsActive) {
        choice = 'high';
        drawCard();

        if (playerHasLost(choice)) {
            gameOver(!playerHasLost(choice));
        } else if (playerHasWon()) {
            updateScore();
            gameOver(playerHasWon());
        } else {
            updateScore();
        }
    }
});

/*
Draw a card then either run the gameOver function or updateScore, depending on whether the next card is higher or lower than the previous card.
 */
document.getElementById('low').addEventListener('click', function() {
    if (gameIsActive) {
        choice = 'low';
        drawCard();
        console.log(drawnCards);
        console.log(playerHasWon());

        if (playerHasLost(choice)) {
            gameOver(!playerHasLost(choice));
        } else if (playerHasWon()) {
            updateScore();;
            gameOver(playerHasWon());
        } else {
            updateScore();
        };
    }
});

/*
Verify whether the player has lost the game.

@param String choice - The choice made by the player.
@return Boolean playerHasLost - Returns true if the player's choice is incorrect.
 */
function playerHasLost(choice) {
    var latestCard, secondLatestCard, playerHasLost;

    latestCard = drawnCards[drawnCards.length - 1];
    secondLatestCard = drawnCards[drawnCards.length - 2];

    if ((choice === 'high' && latestCard[1] < secondLatestCard[1]) || (choice === 'low' && latestCard[1] > secondLatestCard[1])) {
        playerHasLost = true;
    } else {
        playerHasLost =  false;
    }

    return playerHasLost;
}

/*
Check to see if the player has won (winning condition is no cards are left in the deck).

@param none.
@return Boolean playerHasWon - Returns true if the player has won the game.
*/
function playerHasWon() {
    var playerHasWon;

    if (drawnCards.length === 52) {
        playerHasWon = true;
        return playerHasWon;
    } else {
        playerHasWon = false;
        return playerHasWon;
    }
}

/*
Update the DOM, output the game message and set the gameIsActive variable to false.

@param Boolean playerHasWon - The result of the game.
@return void.
 */
function gameOver(playerHasWon) {
    document.getElementById('hi-lo-btn-container').classList.remove('game-started');
    gameIsActive = false;

    setGameFinishedMessage(playerHasWon);
    document.getElementById('shaded-area').classList.remove('inactive');
    document.getElementById('new-game').innerHTML = '<span>Play Again?</span>';
    document.getElementById('new-game').classList.remove('clicked');
}

function updateScore() {
    score++;
    document.getElementById('game-score').textContent = score;
}

/*
If the cards container scrollWidth exceeds the clientWidth, scroll the cards container to show the latest card.

@param none.
@return void.
*/
function scrollToLatestCard() {
    var fullWidth = document.getElementById('cards-container').scrollWidth;
    var visibleWidth = document.getElementById('cards-container').clientWidth;

    if (fullWidth > visibleWidth) {
        var difference = fullWidth - visibleWidth;
        var offset = 7;

        // The value to move the cards container right by is the amount that the full width exceeds the visible width by, plus the offset.
        var rightValue = difference + offset;

        document.getElementById('cards-container').style.right = rightValue + "px";

        updateArrowButtonVisibility(rightValue);
    }
}

/*
Determine which ID and text content to use for the game-message element, based on the outcome of the game.

@param Boolean playerHasWon - The outcome of the game.
@return void.
 */
function setGameFinishedMessage(playerHasWon) {
    var id = (playerHasWon) ? 'game-message-win' : 'game-message-lose';
    var messageText = (playerHasWon) ? 'Perfect Score' : 'Game Over';
    document.querySelector('.game-message').id = id;
    document.querySelector('.game-message').textContent = messageText;
}

/*
Required in order to set viewport height as 100vh on mobile browsers that don't include the address bar
in the height calculation (making the page look longer than 100vh).
 */
function adjustHeightForMobile() {
    document.getElementById('game-area').style.height = window.innerHeight + "px";
    document.getElementById('shaded-area').style.height = window.innerHeight + "px";
}

window.onresize = function() {
    adjustHeightForMobile();
}

window.onload = function() {
    adjustHeightForMobile();
}
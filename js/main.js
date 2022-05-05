// here is the meat of our code, we start by creating a class / constructor called TicTacToeGame

class TicTacToeGame {

    // for class notation, we need to put our properties in a method called "constructor()"
    // this constructor has no parameters, because we don't need to put any in 
    constructor(){
        // this next property keeps track of whether or not it is X's turn or O's turn
        // you could use true/false, "X"/"O", yes / no, 1/0, or other ways.  I went with true/false.
        this.isXTurn = true 

        // this next property keeps track of what's been placed in the board there's multiple things going on here so let's break it down
        // document.querySelectorAll("button")
        //      - select all buttons on the page, and put them into a node list (which is similar to an array)
        // Array.from(previous-line)
        //      - take that node list and convert it to an array.  I wanted to make sure it was actually an array.
        // previous-line.map(button => button.innerText)
        //      - take the array and map a new one, because we only want to know the value of each button
        //      - we get that value by using "innerText"
        // this.boardState = (previous-line)
        //      - we set all of that into a variable called "this.boardState"
        //      - this.boardState should look something like ["", "", "", "", "", "", "", "", ""]
        //      - why? because at the start, all of the tiles are empty, so their values are ""
        this.boardState = Array.from(document.querySelectorAll("button")).map(button => button.innerText)
        
        // the "this.runPlaceHolder" is a property that serves a specific purpose
        // it won't make sense until after the explanation of eventListener and "this" in the next set of comments
        // for now, move on to the next line, and come back here later I explain it more in "this.finishGame()""
        this.runPlaceHolder = this.runTurn.bind(this)

        // next we do something similar to line 24
        // Array.from(document.querySelectorAll("button"))
        //      - take all buttons and put them into an array again, yada, yada
        // previous-line.forEach(button => ... )
        //      - for each of those buttons, I'd like you to...
        // button.addEventListener("click", ...)
        //      - add a "smurf" that notices when the button is clicked on, and the smurf will tell it to...
        // this.runTurn.bind(this)
        //      - run this class's "runTurn" command
        //      - there are two VERY important parts to this line
        //      - first, we use "this.runTurn" instead of "runTurn"; without it, the computer will look for a
        //        function called "runTurn" that's OUTSIDE of the TicTacToeGame class, and we don't have one!
        //      - second, if you were here with us on Saturday, you may remember that we had trouble with "this" in our
        //        tic tac toe methods.  When you tell the computer to do something with "addEventListener," its programmed
        //        to change the value of "this" to whatever element you clicked on.  This broke our code!
        //      - my solution is to use ".bind(this)" so that when we do "runTurn," it knows that when I say "this", I mean the
        //        TicTacToeGame object.
        //      - mr pug also found his own workaround to this, which you can see on github:
        //              https://github.com/BigPugLabs/tictactoe
        

        Array.from(document.querySelectorAll("button")).forEach(button => {
            button.addEventListener("click", this.runPlaceHolder)
        })
        //Array.from(document.querySelectorAll("button")).forEach(button => button.addEventListener("click", this.runTurn.bind(this)))
    }

    runTurn(click){
        // this code runs when a tile is clicked on, and we want it to do three things

        // place the "X" or "O" into the tile
        this.placeTile(click.target)

        // update our boardState variable
        this.updateBoardState()

        // check the boardState to see if anyone won
        // if they did, finish the game
        if (this.checkWinner()){
            this.finishGame()
        }
    }

    placeTile(tile){
        // as long as the tile is empty...
        if (tile.innerText === "") {

            // put an "X" if its their turn, or an "O" otherwise
            tile.innerText = this.isXTurn ? "X" : "O"

            // finally, swap X's turn to O's and vice versa
            // I put this here so that the turns would only swap if the player clicked on an EMPTY tile
            this.isXTurn = !this.isXTurn
        }
    }

    updateBoardState(){
        // take a look at whats in all the buttons and put them into an array
        // this was covered in more detail in the constructor
        this.boardState = Array.from(document.querySelectorAll("button")).map(button => button.innerText)

        // (optional) use this line if you want to see the board state update throughout the game:
        // console.log(this.boardState)
    }

    checkWinner(isXTurn){
        // have a variable for whoseTurn it is
        // remember, we already swapped the turn in placeTile(), so I inverted the logic
        const whoseTurn = this.isXTurn ? "O" : "X"

        // prepare a list of solutions that we'll use shortly
        // honestly, you could put this as a property in the constructor if you wanted to
        // (optional) let me explain the logic of these numbers here
        // you win tic tac toe if your X's or O's...
        // fill the top row (indexes 0, 1 and 2 of our boardState)
        // fill the middle row (indexes 3, 4, and 5)
        // fill the bottom row (6, 7, 8)
        // OR
        // fill the left column (0, 3, 6)
        // fill the middle column (1, 4, 7)
        // fill the right column (2, 5, 8)
        // OR
        // fill the left-to-right diagonal (0, 4, 8)
        // OR
        // fill the right-to-left diagonal (2, 4, 6)
        const solutions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]

        // this part is about checking for a winner
        // first, grab the boardState
        // modify it:
        //      if it was just X's turn, find all the indexes where an X was placed
        //      if it was just O's turn, find all the indexes where an O was placed
        // put it into a string
        const indexes = this.boardState.reduce((acc, tile, idx) => tile === whoseTurn ? acc + idx : acc, "")

        // (optional) use this line if you want to see what the running total of indexes looks like
        // console.log(`${whoseTurn}s can be found in positions: ${indexes}`)

        // look through the list of solutions (each array in the main array)
        // for each, check that our list of indexes has every number
        // if this happens for at least ONE of the potential solutions, then the game is won
        return solutions.some(solution => solution.every(num => indexes.includes(num)))

        // (optional) if you want to console whether or not the game was won, you could use this line:
        // console.log(solutions.some(solution => solution.every(num => indexes.includes(num))))
    }

    finishGame(){
        // next we remove all event listeners
        // however, we have another quirk.  Back in the constructor, I created the runPlaceHolder property for this specific reason
        // The game runs perfectly fine without it, but when it comes time to remove the event listener,
        // the computer doesn't know which listener to actually remove.
        // Setting a variable that points to the same spot in memory did the trick
        // (optional) try replacing "this.runPlaceHolder" with "this.runTurn.bind(this)". Does anything change?
        document.querySelectorAll("button").forEach(button => {
            button.removeEventListener("click", this.runPlaceHolder)
        })
        // print which side won
        // again, we used inverted logic for the X's and O's since this.isXTurn was already swapped
        document.querySelector("#output").innerText = `The ${this.isXTurn ? "O" : "X"}s WON!`
    }
}

// We need to create a tic tac toe game, or else none of the above would actually run!
let ticTacToe = new TicTacToeGame()

// Remember, this is just one of many, MANY ways of implementing tic tac toe.  Improve it, break it, and play around to make it your own. 
// END
// JavaScript Document

var x = "assets/x-mark.png"
var o = "assets/o-mark.png"
var blank = "assets/blank.png"
var count = 0;
var finished = false;
var game_count = 1;
var o_win = 0;
var x_win = 0;
var tie_count = 0
var boardSize = 3
let winCondition = 3
var board = []
var turn = "O"


function generateBoard() {
  $("#board2").css({"background-color": "white", "width": `${80 * boardSize}px`, "height": `${80 * boardSize}px, "margin": "0"`});
  for(a = 0 ; a < boardSize * boardSize; a++){
    let z = `<img id=${a} src='./assets/blank.png' style='width: 80px; height: 80px; border: 1px solid black;'/>`
    $("#board2").append(z)
  }
}
generateBoard() //First Generate board

function generateWinCondDD() {
  for(a = 2; a <= boardSize; a++) {
    $("#winDropdown").append($('<option />', {value: a, text: a}));
  }
  $("#winDropdown").val(boardSize);
  winCondition = boardSize
}

function reset() {
  $("#board2 img").each(function(index, value){
   value.src = blank
 })
  $("#game img").removeClass('disable')
  $("#game img").removeClass('o')
  $("#game img").removeClass('x')
  $('#o_turn').text(game_count % 2 === 0 ? "" : "Turn")
  $('#x_turn').text(game_count % 2 === 0 ? "Turn" : "")
  count = 0
  finished = false
  board = []
  turn = game_count % 2 === 0 ? "X" : "O"
  console.log('start',turn)
};

function simpleArray(inputArray){
  let arrayForWinner
  for( d = 0; d <= boardSize - winCondition ; d++) {
    arrayForWinner = inputArray.slice(d, d + winCondition)
    decideWinner(arrayForWinner)
  }
}

function decideWinner(inputArray){
  const checkUndefined = inputArray.includes(undefined)
  console.log('inputArray', inputArray)
  if (inputArray.length === winCondition && !checkUndefined && !finished) {
    console.log('inputArray inside', inputArray)
    let allEqual = inputArray.every( (val, i, arr) => val === arr[0] && val !== undefined)
    if(allEqual) {
      finished = true;
      if(turn === "O"){ //reversed because turn value already changed
        x_win++
        $('#x_win').text(x_win)
      } else {
        o_win++
        $('#o_win').text(o_win)
      }
      let returnVal = confirm(`${turn === "O" ? "X" : "O"} Wins the game! Play another round?`)
      if(returnVal) {
        game_count++
        $('#game_count').text(game_count)
        return reset()
      }
    }   
  }
}

function checkWinner() {
  console.log(boardSize)
  let check = []
  let check1 = []
  let check2 = []

  // TIE
  if (count === boardSize * boardSize) {
      game_count++
      tie_count++
      finished = true;
      alert('Its a tie.')
      $('#game_count').text(game_count)
      $('#tie_count').text(tie_count)
      reset()
    }

  // Check Row
  for(a = 0; a < boardSize*boardSize; a+=boardSize){
    check = board.slice(a,a+boardSize)
    simpleArray(check)
  }

  check = []

  // Check Column
  for(c = 0; c < boardSize; c++){
    for(b = 0; b < boardSize; b++) check.push(board[c + (b*boardSize)])
    simpleArray(check)
    check = []
  }

  // Check Diagonal
  for(z = 0; z <= boardSize - winCondition; z++){
    let nextLine = z * boardSize
    for(d = 0; d <= boardSize - winCondition; d++){
      // Diagonal "\"
      for(e = 0; e < winCondition; e++) check1.push(board[e * boardSize + d + e + nextLine])
      decideWinner(check1)
      check1 = []
      // Diagonal "/"
      for(f = 1; f <= winCondition; f++) check2.push(board[f * boardSize - f - d + nextLine])
      decideWinner(check2)
      check2 = []
    }
  }
}


$('#scaleDropdown').change(function(){
  let sel = document.getElementById('scaleDropdown');
  let strUser = sel.options[sel.selectedIndex].value;
  boardSize = Number(strUser)
  $('#board2').empty()
  $('#winDropdown').empty()
  generateBoard()
  generateWinCondDD()
  if(finished){
    game_count++
    $('#game_count').text(game_count)
  }
  reset()
})

$('#winDropdown').change(function(){
  let sel = document.getElementById('winDropdown');
  let strUser = sel.options[sel.selectedIndex].value;
  winCondition = Number(strUser)
  if(finished){
    game_count++
    $('#game_count').text(game_count)
  }
  reset()
})

$('#game').on("click", "img", function(){
  console.log('finished', finished)
  if (finished) {
    //do nothing
  } else if ($(this).hasClass('disable')) {
    alert('Already selected')
  } else if (turn == "O") {
    count++
    this.src = o
    board[$(this).attr('id')] = "O"
    turn = "X"
    $(this).addClass('disable')
    $('#o_turn').text('')
    $('#x_turn').text('Turn')
    checkWinner()
  } else {
    count++
    board[$(this).attr('id')] = "X"
    this.src = x
    turn = "O"
    $(this).addClass('disable')
    $('#o_turn').text('Turn')
    $('#x_turn').text('')
    checkWinner() 
  }
})

$("#reset").click(function(){
  finished ? game_count++ : console.log('not finished');
  $('#game_count').text(game_count)
  reset()
});

$("#restart").click(function(){
  const restartConfirm = confirm('Restarting the game ?')
  if (restartConfirm){
    tie_count = 0
    game_count = 1
    o_win = 0
    x_win = 0;
    reset()
    $('#game_count').text(game_count)
    $('#x_win').text(x_win)
    $('#o_win').text(o_win)
  }
});

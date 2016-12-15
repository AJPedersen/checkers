$( document ).ready(function() { //BEGIN DOCUMENT READY -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-

	makeGrid();
	addPieces();
	populateBoardState();
	var selectedPiece = null;
	var turn = 'blue';
	lastCell = [];
	$('.blackcell').click(function() {
		// clickedCell.length = 0;
		// openCells.length = 0;
		var rawId = $(this).attr('id');
		var id = { //
			row: rawId.slice(-2, -1),
			cell: rawId.slice(-1)
		};

		var currCell = boardState[id.row][id.cell];
		//lastCell = lastCell.push(currCell);
		if (currCell) { //if clicked cell is occupied then do:
			if (currCell.color === turn) {
				selectedPiece = currCell;
			} 
		} else { //if clicked cell is empty then do:

			if (selectedPiece) { //if piece was previously clicked

				var targets = getTargets(selectedPiece);

				if (canMoveTo(id, targets)) {
					movePiece(selectedPiece, id);
				}
			}

			
			
		}
		// lastClickedCell.push(parseInt( $(this).attr('id').slice(-2), 10 ));
		// clickedCell = $(this).attr('id').slice(-2); // Pushes cell to clickedCell array

		// console.log('clickedCell:', clickedCell);
		// console.log('lastClickedCell:', lastClickedCell[lastClickedCell.length - 2]);

		// canMove();
		// selectPiece();
			
	});

	selectPiece();
	getOpenCells();
	hoverClass();

	

}); //END_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-


clickedCell = '';
lastClickedCell = [];
selectedPiece = '';
var boardState = [];

function makeGrid(){ //for loop to generate 2D board and array https://www.youtube.com/watch?v=qfukKmHOKU4
	for (var r = 0; r <= 7; r++) {
		$("#grid").append("<div id='row" + r + "'></div>");
		for (var c = 0; c <=7 ; c++) { //runs 7 times for each i loop
			//$('#row' + r).append("<div id='cell" + r + c + "'>" + r + c + "</div>");
			if ((r+c) % 2 == 0) {
				$('#row' + r).append("<div class = blackcell id=cell" + r + c + ">" + r + c + "</div>");
				//if row in first three, add shillary
				//if row in last three, add drumpf
			}
			else {
				$('#row' + r).append("<div class = whitecell id=cell" + r + c + ">" + r + c + "</div>");
			}
		}
	}
};

function addPieces(){
	for (var r = 0; r <= 7; r++) {
		for (var c = 0; c <=7 ; c++) { //runs 7 times for each i loop
			if ((r+c) % 2 == 0 && (r.toString() + c.toString()) <= 26) {
				$('#cell' + r + c).append("<img src='assets/shillaryblue.png' alt='pic of Shillary Clinton, shaded blue' class='shillary'></img>");
			} 
			else if ((r+c) % 2 == 0 && (r.toString() + c.toString()) >= 51 && (r.toString() + c.toString()) <= 77) {
				$('#cell' + r + c).append("<img src='assets/drumpfred.png' alt='pic of Don Drumpf, shaded red' class='drumpf'></img>");
			}
			//add pieces on load to black cells up to 26 and then from 51-77, 12 pieces each side, 24 pieces total
		}
	}

};

	
function populateBoardState(){
	for (var r = 0; r <= 7; r++) {
		boardState.push(new Array(8));
		for (var c = 0; c <=7 ; c++) { //runs 7 times for each i loop
			if ((r+c) % 2 == 0 && (r.toString() + c.toString()) <= 26) {
			//if row in first three, add shillary
				boardState[r][c] = { 
					color: 'blue',
					isKing: false,
					row: r,
					col: c,
					cell: ''+r+c
				};
			} 
			else if ((r+c) % 2 == 0 && (r.toString() + c.toString()) >= 51 && (r.toString() + c.toString()) <= 77) {
				//if row in last three, add drumpf
				boardState[r][c] = { 
					color: 'red',
					isKing: false,
					row: r,
					col: c,
					cell: ''+r+c 
				};
			}
		}
	}
};

function hoverClass(){ //change opacity of empty .blackcell on hover
	$('.blackcell').hover(function() {
		//if ($(this).has('img:not')) {
			$('.blackcell').hover(
				function()  {	
				$(this).css("background-color", "grey");
		    	}, function(){
		    	$(this).css("background-color", "black");
		    	}
			);
		//}
	});
}

function selectPiece(){ 
	if (boardState) {}
	$('.blackcell').find('img').click(function(){ //Needs to check for object in boardState instead of checking for img
		$('.blackcell').find('img').removeClass('selected'); //remove highlight from previously selected piece
		$(this).addClass('selected'); //highlight piece
		
	});
};

openCells = [];
function getOpenCells(){ //return array of open cells of selected piece

	//var selectedRowCol = $('img').hasClass('selected').closest('div').attr('id').slice(-2);	
	//find open cells around selected piece at row +/- 1 and cell +/- 1
	$('.blackcell').find('img').click(function(){ 
		var selectedRow = parseInt($(this).closest('div').attr('id').slice(-2, -1), 10);
		var selectedCell = parseInt($(this).closest('div').attr('id').slice(-1), 10);
		//var selectedRowCell = parseInt(("" + selectedRow+selectedCell), 10);
		//openCells.length = 0;
		//console.log(selectedRowCell)
		//find cells at selectedRow
		//if (selectedRow + 1 <= 7 && selectedCell + 1 <= 7 && selectedRow - 1 <= 7 && selectedCell - 1 <= 7 && selectedCell - 1 > 0) {
		if (!boardState[selectedRow + 1][selectedCell + 1]) { //1 down 1 right
			openCells.push( ("" + (selectedRow+1) + (selectedCell+1) ) );
			//console.log('cell open at 1 down 1 right ' + ("" + (selectedRow+1) + (selectedCell+1)))
		}
		if (!boardState[selectedRow + 1][selectedCell - 1]) { //1 down 1 left
			openCells.push( ("" + (selectedRow+1) + (selectedCell-1)) );
			//console.log('cell open at 1 down 1 left ' + ("" + (selectedRow+1) + (selectedCell-1)))
		}
		if (!boardState[selectedRow - 1][selectedCell - 1]) { //1 up 1 left
			openCells.push( ("" + (selectedRow-1) + (selectedCell-1)) );
			//console.log('cell open at 1 up 1 left ' + ("" + (selectedRow-1) + (selectedCell-1)))
		}
		if (!boardState[selectedRow - 1][selectedCell + 1]) { //1 up 1 right
			openCells.push( ("" + (selectedRow-1) + (selectedCell+1)) );
			//console.log('cell open at 1 up 1 right ' + ("" + (selectedRow-1) + (selectedCell+1)))
		}
		console.log('openCells:',openCells);
		return openCells
	});
};

function getSingleMoveTargets(currCell){
	var openCells = [];

	if (currCell) {
		//can the selected piece move here? Check to see if it is within the piece's radius and in the right direction
		var dir = currCell.color === 'blue' ? -1 : 1; //if obj.color is blue then negative (-1), else positive (1)

		if (!boardState[currCell.row + dir][currCell.col + 1]) { //1+/- depending on dir 1 right 
			openCells.push(boardState[currCell.row + dir][currCell.col + 1]);
			//console.log('cell open at 1 down 1 right ' + ("" + (selectedRow+1) + (selectedCell+1)))
		}
		if (!boardState[currCell.row + dir][currCell.col - 1]) { //1+/- depending on dir 1 left 
			openCells.push(boardState[currCell.row + dir][currCell.col -1]);
			//console.log('cell open at 1 down 1 left ' + ("" + (selectedRow+1) + (selectedCell-1)))
		}

		return openCells;
	}

	//if so, do so
	//if n0t... don't....
	// if (openCells.includes(currCell)) {
	// 	movePiece()
	// 	clickedCell.length = 0;
	// 	openCells.length = 0;
	// 	console.log('MOVED PIECE')
	// }//  else { 
	// 	clickedCell = clickedCell;
	// 	openCells = openCells;
	// 	console.log('NOOOOTTT MOVED PIECE')
	// }
		
	 	
}

function getTargets(currCell){ //
	var targets = [];
	targets = targets.concat(getSingleMoveTargets(currCell));
	// targets = targets.concat(getJumpMoveTargets(currCell));

	return targets;
}

function getJumpMoveTargets(){
	// var openCells = [];

	// if (currCell) {
	// 	//can the selected piece move here? Check to see if it is within the piece's radius and in the right direction
	// 	var dir = currCell.color === 'blue' ? -1 : 1; //if obj.color is blue then negative (-1), else positive (1)

	// 	if (!boardState[currCell.row + dir][currCell.cell + 1]) { //1+/- depending on dir 1 right 
	// 		openCells.push( ("" + (currCell.row+1) + (currCell.cell+1) ) );
	// 		//console.log('cell open at 1 down 1 right ' + ("" + (selectedRow+1) + (selectedCell+1)))
	// 	}
	// 	if (!boardState[currCell.row + dir][currCell.cell - 1]) { //1+/- depending on dir 1 left 
	// 		openCells.push( ("" + (currCell.row+1) + (currCell.cell-1)) );
	// 		//console.log('cell open at 1 down 1 left ' + ("" + (selectedRow+1) + (selectedCell-1)))
	// 	}

	// 	return openCells;
	// }
}

function canMoveTo(id, targets){ //both objects

	for (var i = 0; i < targets.length; i++) { //need to loop through targets to see if it contains id (which is the id of the currently clicked cell)
		if (targets.hasOwnProperty(id.cell)) {
			return true;
		}
	}
	return false;

	// var cell = id.cell;
	// for (cell in targets){
	// 	var canMove = true;
	// }
	// return canMove;
}


function movePiece(currCell, id){

	var piece = $('#cell' + currCell).filter('img');
	$('#cell' + currCell).append(piece); //moves piece img to cellTo
	$('#cell' + currCell).find('img').removeClass('selected');

	//add boardState entry for piece (new location)
	boardState.push({ 
					color: boardState[id.row][id.cell].color,
					isKing: false,
					row: id.row,
					col: id.col,
					cell: id.cell
				});

	cleanCell(currCell.row, currCell.cell)
	  
	
}

function cleanCell(x,y){
	//remove boardState entry for piece (old location)
	boardState[x][y] = null; //nulls out the object
	$('#cell' + x + y).html('');

}

/*

rowcolumn

00 01 02 03 04 05 06 07

10 11 12 13 14 15 16 17

20 21 22 23 24 25 26 27

30 31 32 33 34 35 36 37

40 41 42 43 44 45 46 47

50 51 52 53 54 55 56 57

60 61 62 63 64 65 66 67

70 71 72 73 74 75 76 77

*/
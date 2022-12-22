var reversi = {
    father: null,
    score: null,

    rows: 8,
    cols: 8,
    grid: [],
    states: {
        'blank': { 'id' : 0, 'color': 'yellow' },
        'white': { 'id' : 1, 'color': 'white' },
        'black': { 'id' : 2, 'color': 'black' }
    },
    turn: null,

    init: function(selector) {

        this.father = document.getElementById(selector);

        // make sure we have a valid element selected
        if (null === this.father) {
            return;
        }

        // append .reversi class to the father element
        this.father.className = (this.father.className ? this.father.className + ' ' : '') + 'reversi';

        // prepare and draw grid
        this.prepareGrid();

        // place initial items
        this.initGame();
    },

    initGame: function() {

        // the black player begins the game
        this.setTurn(this.states.black);

        // init placement
        this.setItemState(4, 4, this.states.white);
        this.setItemState(4, 5, this.states.black);
        this.setItemState(5, 4, this.states.black);
        this.setItemState(5, 5, this.states.white);

        // set initial score
        this.setScore(2, 2);
    },

    prepareGrid: function() {

        // create table structure for grid
        var table = document.createElement('table');

        // apply some base styling for table
        table.setAttribute('border', 1);
        table.setAttribute('cellpadding', 0);
        table.setAttribute('cellspacing', 0);

        for (var i = 1; i <= this.rows; i++) {

            var tr = document.createElement('tr');

            table.appendChild(tr);

            this.grid[i] = [];

            for (var j = 1; j <= this.cols; j++) {

                var td = document.createElement('td');

                tr.appendChild(td);

                // bind move action to onclick event on each item
                this.bindMove(td, i, j);

                // we are also storing html element for better manipulation later
                this.grid[i][j] = this.initItemState(td.appendChild(document.createElement('span')));
            }
        }

        // prepare score bar
        var scoreBar = document.createElement('div'),
            scoreBlack = document.createElement('span'),
            scoreWhite = document.createElement('span');

        scoreBlack.className = 'score-node score-black';
        scoreWhite.className = 'score-node score-white';

        // append score bar items
        scoreBar.appendChild(scoreBlack);
        scoreBar.appendChild(scoreWhite);

        // append score bar
        this.father.appendChild(scoreBar);

        // set the score object
        this.score = {
            'black': {
                'elem': scoreBlack,
                'state': 0
            },
            'white': {
                'elem': scoreWhite,
                'state': 0
            },
        }

        // append table
        this.father.appendChild(table);
    },

    initItemState: function(elem) {

        return {
            'state': this.states.blank,
            'elem': elem
        };
    },

    bindMove: function(elem, row, col) {
        var self = this;
        elem.onclick = function(event) {
            if (self.canMove()) {
                // if have a valid move
                if (self.isValidMove(row, col)) {
                    // make the move
                    self.move(row, col);
                    // check whether the another player can now move, if not, pass turn back to other player
                    if ( ! self.canMove()) {
                        self.passTurn();
                        // check the end of the game
                        if ( ! self.canMove()) {
                            self.endGame();
                        }
                    }

                    // in case of full grid, end the game
                    if (self.checkEnd()) {

                        self.endGame();
                    }
                }
            }
        };
    },

    setTurn: function(state) {

        this.turn = state;

        var isBlack = (state.id === this.states.black.id);

        this.score.black.elem.style.textDecoration = isBlack ? 'underline': '';
        this.score.white.elem.style.textDecoration = isBlack ? '': 'underline';
    },

    setItemState: function(row, col, state) {
//        if ( ! this.isValidPosition(row, col)) {
//            return;
//        }
        this.grid[row][col].state = state;
        this.grid[row][col].elem.style.visibility =  this.isVisible(state) ? 'visible' : 'hidden';
        this.grid[row][col].elem.style.backgroundColor = state.color;
    },

    setScore: function(scoreBlack, scoreWhite) {

        this.score.black.state = scoreBlack;
        this.score.white.state = scoreWhite;

        this.score.black.elem.innerHTML = '&nbsp;' + scoreBlack + '&nbsp;';
        this.score.white.elem.innerHTML = '&nbsp;' + scoreWhite + '&nbsp;';
    },

    isVisible: function(state) {
        return (state.id === this.states.white.id || state.id === this.states.black.id);
    },
// document.getElementById('buttonX').checked = true;
}
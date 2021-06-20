import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

let winningSquares = null;

function Square(props) {
    return (
        <button
            className={props.isWinningSquare ? "winningSquare" : "square"}
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        let isWinningSquare = false;

        if (this.props.winningSquares) {
            isWinningSquare = this.props.winningSquares.includes(i);
        }
        return (
            <Square
                id={i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                isWinningSquare={isWinningSquare}
            />
        );
    }

    setSquareColour(squareNum) {
        console.log('change colour of square: ' + squareNum);
    }

    render() {
        var rows = [];
        var idx = 0;
        for (var i = 0; i < 3; i++) {
            var row = [];
            for (var j = 0; j < 3; j++) {
                row.push(<span key={j}>{this.renderSquare(idx)}</span>);
                idx++;
            }
            rows.push(<div key={i} className="board-row">{row}</div>);
        }
        return (
            <div>
                {rows}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                location: [0, 0],
            }],
            stepNumber: 0,
            xIsNext: true,
            isReversed: false,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) { // if either not null, don't update sq
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                location: [i % 3, Math.floor(i / 3)],
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    reorderGameHistory() {
        this.setState({
            isReversed: !this.state.isReversed,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move + ' at ' + step.location :
                'Go to game start';
            return (
                <li key={move}>
                    <button style={this.state.stepNumber === move ? { fontWeight: 'bold' } : { fontWeight: 'normal' }} onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
            if (this.state.stepNumber == 9) {
                status = 'The match is a draw.';
            }
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        winningSquares={winningSquares}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick={() => this.reorderGameHistory()}>{'Reorder game history'}</button>
                    <ol>{this.state.isReversed ? moves.reverse() : moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            console.log([a, b, c]);
            winningSquares = [a, b, c];
            return squares[a];
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);


import "./Grid.css";
import Tile from "../tile/Tile.js";
import React from "react";

class Grid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: props.size,
      tiles: new Array(props.size * props.size).fill(null),
      turn: 0,
      round: 0,
      scoring: [],
      players: [
        {
          alias: "Player 1",
          icon: "X",
        },
        {
          alias: "Player 2",
          icon: "O",
        },
      ],
    };
    console.log(
      `new Grid(${this.state.size}, ${this.state.size}) connect ${this.state.size} to win`
    );

    this.handleTileClick = this.handleTileClick.bind(this);
    this.renderTile = this.renderTile.bind(this);
    this.getStatus = this.getStatus.bind(this);
    this.moveStack = [];
  }
  getCurrentPlayer() {
    return this.state.players[this.state.turn % this.state.players.length];
  }
  handleActionButton() {
    if (this.state.gameover || this.moveStack.length <= 0) {
      this.moveStack = [];
      this.setState({
        scoring: [],
        gameover: false,
        turn: 0,
        round: this.state.round + 1,
        tiles: new Array(this.state.size * this.state.size).fill(null),
      });
      return;
    }
    let tiles = this.state.tiles.slice();
    tiles[this.moveStack.pop()] = null;
    this.setState({
      tiles: tiles,
      turn: this.state.turn - 1,
    });
  }
  indexToCoordinate(i) {
    const x = i % this.state.size;
    const y = Math.floor(i / this.state.size);
    return { x, y };
  }
  coordinateToIndex(x, y) {
    return x + this.state.size * y;
  }
  checkScore() {
    const lastMove = this.moveStack[this.moveStack.length - 1];
    const playerLastMove = this.state.tiles[lastMove];
    const { x, y } = this.indexToCoordinate(lastMove);
    console.log(`last move: ${lastMove} - ${x},${y}`);

    if (playerLastMove === null) {
      console.log(`player last move ${playerLastMove}`);
      return [];
    }

    if (this.moveStack.length === this.state.tiles.length) {
      this.setState({ gameover: true });
      return [];
    }

    let linked = {
      x: [],
      y: [],
      diag: [],
      revDiag: [],
    };
    for (let i = 0; i < this.state.size; i++) {
      const xi = this.coordinateToIndex(i, y);
      const yi = this.coordinateToIndex(x, i);
      const di = this.coordinateToIndex(i, i);
      const rdi = this.coordinateToIndex(i, this.state.size - (i + 1));
      if (this.state.tiles[xi] === playerLastMove) {
        linked.x.push(xi);
      } else if (linked.x.length < this.state.size) {
        linked.x = [];
      }
      if (this.state.tiles[yi] === playerLastMove) {
        linked.y.push(yi);
      } else if (linked.y.length < this.state.size) {
        linked.y = [];
      }
      if (this.state.tiles[di] === playerLastMove) {
        linked.diag.push(di);
      } else if (linked.diag.length < this.state.size) {
        linked.diag = [];
      }
      if (this.state.tiles[rdi] === playerLastMove) {
        linked.revDiag.push(rdi);
      } else if (linked.revDiag.length < this.state.size) {
        linked.revDiag = [];
      }
    }
    for (let obj in linked) {
      console.log(`checking ${JSON.stringify(obj)}`);
      if (linked[obj].length >= this.state.size) {
        return linked[obj];
      }
    }
    return [];
  }
  handleTileClick(index) {
    if (this.state.tiles[index] !== null || this.state.gameover) {
      return;
    }
    let tiles = this.state.tiles.slice();
    tiles[index] = this.getCurrentPlayer().icon;
    this.moveStack.push(index);
    this.setState({ tiles: tiles, turn: this.state.turn + 1 }, () => {
      let scoring = this.checkScore();
      console.log(`scoring: ${scoring}`);
      if (scoring.length > 0) {
        this.setState({
          gameover: true,
          turn: this.state.turn - 1,
          scoring: scoring,
        });
      }
    });
  }
  getStatus() {
    if (this.state.gameover) {
      if (this.moveStack.length === this.state.tiles.length) {
        return "Draw";
      }
      return `${this.getCurrentPlayer().icon} Wins!`;
    }
    return `${this.getCurrentPlayer().icon}'s turn`;
  }
  actionButtonText() {
    if (this.state.gameover) {
      return "Play again?";
    }
    return "Undo";
  }
  renderRows() {
    return new Array(this.state.size).fill(this.turn).map((_, rowIndex) => {
      return (
        <div className={"row"} key={`row_${rowIndex}`}>
          {this.state.tiles
            .slice(
              this.state.size * rowIndex,
              this.state.size * rowIndex + this.state.size
            )
            .map((value, index) => {
              const indexTransformed = this.state.size * rowIndex + index;
              return this.renderTile(
                indexTransformed,
                this.state.scoring.includes(indexTransformed)
              );
            })}
        </div>
      );
    });
  }
  renderTile(index, highlight) {
    return (
      <Tile
        highlight={highlight}
        value={this.state.tiles[index]}
        onClicked={this.handleTileClick.bind(this, index)}
        key={`tile_${index}`}
      ></Tile>
    );
  }
  render() {
    const status = this.getStatus();

    return (
      <section>
        <article id="status">{status}</article>
        <div id="grid">{this.renderRows()}</div>
        <button
          disabled={this.moveStack.length < 1}
          id="action-btn"
          onClick={this.handleActionButton.bind(this)}
        >
          {this.actionButtonText()}
        </button>
      </section>
    );
  }
}

export default Grid;

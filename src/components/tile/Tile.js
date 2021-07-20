import React from "react";
import "./Tile.css";

class Tile extends React.Component {
  getClasses() {
    let classes = "tile ";
    if (this.props.value === null) {
      classes += "empty ";
    }
    if (this.props.highlight) {
      classes += "highlight ";
    }
    return classes.trim();
  }
  render() {
    return (
      <div className={this.getClasses()} onClick={this.props.onClicked}>
        {this.props.value}
      </div>
    );
  }
}

export default Tile;

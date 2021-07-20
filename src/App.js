import "./App.css";
import Grid from "./components/grid/Grid.js";

function App() {
  return (
    <div className="App">
      <header className="App-header">Tic-Tac-Toe</header>
      <Grid size={4} />
    </div>
  );
}

export default App;

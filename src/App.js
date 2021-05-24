import Host from "./agora/Host";
import Audience from "./agora/Audience";
import { Switch, Route, useLocation } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <Switch>
      <Route exact path="/">
        <Host />
      </Route>
      <Route path="/audience">
        <Audience />
      </Route>
    </Switch>
  );
}

export default App;

import React from 'react';
import { DatabaseHookProvider, useDatabase } from 'react-normalizer-hook/dist';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ListPage from './pages/ListPage';
import DetailPage from './pages/DetailPage';

const App: React.FC = () => {
  const databaseHook = useDatabase();
  return (
    <DatabaseHookProvider value={databaseHook}>
      <Router>
        <Switch>
          <Route exact path="/:id">
            <DetailPage />
          </Route>
          <Route path="/">
            <ListPage />
          </Route>
        </Switch>
      </Router>
    </DatabaseHookProvider>
  );
};

export default App;

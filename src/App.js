import React from 'react';
import HooksRedux from './hooks-redux'
import './App.css';
const { Provider, store } = HooksRedux({
  isDev: true,
  initialState: { jg: 'hooks-redux', age: 0 }
})

function actionAdd() {
  return {
    type: 'addCount',
    reducer(state) {
      return { ...state, age: state.age + 1 }
    }
  }
}

function Button() {
  function handleAdd() {
    store.dispatch(actionAdd())
  }
  return <button onClick={handleAdd}>click</button>
}

function Page() {
  const state = store.useContext()
  return (
    <>
      {state.age} <Button />
    </>
  )
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
       <Provider>
        <Page />
       </Provider>
      </header>
    </div>
  );
}

export default App;

import React, { useReducer, createContext, useContext } from 'react'
// action -> dispatch -> reducer

function middleWareLog(state, lastState, nextState, action) {
  console.log('->action:', action.type)
  console.log('->last:', lastState)
  console.log('->next:', nextState)
}

// 集成reducer到action
const reducerInAction = (state, action) => {
  // Action 和 Reducer 不分开，action 对状态的管理 直接生效
  if (typeof action.reducer === 'function') {
    return action.reducer(state)
  }
  return state
}

export default function createStore(params) {
  const { initialState, reducer, middleware, isDev } = {
    isDev: false,
    initialState: {},
    reducer: reducerInAction,
    middleware: [middleWareLog],
    ...params
  }
  const Context = createContext()
  // store 只有修改状态，得到状态
  const store = {
    _state: initialState,
    dispatch: undefined,
    useContext: function() {
      return useContext(Context)
    },
    getState: function() {
      return store._state
    }
  }
  let isCheckedMiddleWare = false
  const middleWareReducer = (lastState, action) => {
    // action 修改
    let nextState = reducer(lastState, action)
    if (!isCheckedMiddleWare) {
      if (!Array.isArray(middleware)) {
        throw new Error('error: middleware is not an array!')
      }
      isCheckedMiddleWare = true
    }
    // 中间件修改
    for (let item of middleware) {
      const newState = item(store, lastState, nextState, action, isDev)
      if (newState) {
        nextState = newState
      }
    }
    return nextState
  }
  const Provider = props => {
    const [state, dispatch] = useReducer(middleWareReducer, initialState)
    if (!store.dispatch) {
      store.dispatch = async function(action) {
        dispatch(action)
      }
    }
    return <Context.Provider {...props} value={state} />
  }
  return {
    Provider,
    store
  }
}
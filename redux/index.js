

function createStore(initialState, reducer) {
    let currentState = initialState;
    let subscribes = [];

    let store = {
        dispatch: (action) => {
            currentState = reducer(currentState, action);
            for (let i = 0; i < subscribes.length; i++) {
                let cb = subscribes[i];
                cb && cb(currentState);
            }
        },
        subscribe: (fn) => {
            subscribes.push(fn);
            return () => {
                let index = subscribes.findIndex(fn);
                if (index !== -1) {
                    subscribes.splice(index, 1);
                }
            }
        },
        getState: () => {
            return currentState
        }
    };

    return store;
}



const initialState = {
    age: 100,
    todos: [
        { a: 1, b: 0 },
        { a: 2, b: 0 },
        { a: 3, b: 0 },
    ]
}

const reducer = (state, action) => {
    switch (action.type) {
        case "addItem":
            return {
                ...state,
                todos: [
                    ...state.todos,
                    { a: state.todos.length + 1, b: 0 }
                ]
            }
        case "addAge":
            return {
                ...state,
                age: state.age + 1
            }
    }
}

const store = createStore(initialState, reducer);


store.subscribe((state) => {
    console.log(state);
})

store.dispatch({
    type: "addItem"
})

store.dispatch({
    type: "addAge"
})
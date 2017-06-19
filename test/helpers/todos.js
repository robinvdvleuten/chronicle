const id = (state = []) =>
  state.reduce((result, item) => (item.id > result ? item.id : result), 0) + 1;

const ACTIONS = {
  ADD_TODO: (state, { text }) => [...state, { id: id(state), text }],
};

export function addTodo(text) {
  return { type: 'ADD_TODO', text };
}

export default function todos(state = [], action) {
  return action && ACTIONS[action.type]
    ? ACTIONS[action.type](state, action)
    : state;
}

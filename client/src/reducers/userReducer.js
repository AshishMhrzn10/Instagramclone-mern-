export const initialState = null;

export const reducer = (state, action) => {
	if (action.typ === "USER") {
		return action.payload;
	} else {
		return state;
	}
};

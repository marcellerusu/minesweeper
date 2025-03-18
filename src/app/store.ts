import { configureStore } from "@reduxjs/toolkit";
import * as reactRedux from "react-redux";
import gameReducer from "./state/game";

export const store = configureStore({ reducer: { game: gameReducer } });

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export function useSelector<T>(selector: (state: RootState["game"]) => T) {
  return reactRedux.useSelector<RootState, T>((state) => selector(state.game));
}

export function useDispatch() {
  return reactRedux.useDispatch<AppDispatch>();
}

import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface AnswerType {
  answerId: number;
  questionId: number;
  memberId: number;
  nickname: string;
  content: string;
  createdAt: string;
  movie: {
    title: string;
    poster: string;
    prodYear: string;
  };
}

interface InitialStateType {
  answers: AnswerType[];
}

const initialState: InitialStateType = { answers: [] };

export const answerListSlice = createSlice({
  name: 'answerList',
  initialState,
  reducers: {
    setAnswerList(state, action) {
      state.answers = action.payload;
    },
    addAnswerList(state, action) {
      state.answers.push(action.payload);
    },
    editAnswerList(state, action) {
      const targetIndex = state.answers.findIndex(
        (answer) => answer.answerId === action.payload.answerId,
      );
      state.answers.splice(targetIndex, 1, action.payload);
    },
    deleteAnswerList(state, action: PayloadAction<AnswerType>) {
      const answerDelete = action.payload;
      state.answers = state.answers.filter(
        (answer) => answer.answerId !== answerDelete.answerId,
      );
    },
  },
});

export const {
  setAnswerList,
  addAnswerList,
  editAnswerList,
  deleteAnswerList,
} = answerListSlice.actions;

export default answerListSlice.reducer;

import api from "../api";

export const getDueWords = data => dispatch => api.word.getDueWords(data);
export const wordResult = data => dispatch => api.word.wordResult(data);

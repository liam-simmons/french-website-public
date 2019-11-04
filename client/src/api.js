import axios from "axios";
import configuration from "./configuration";

export default {
  user: {
    signup: user =>
      axios.post("/api/users/signup", user).then(res => res.data.user),
    login: user =>
      axios.post("/api/users/signin", user).then(res => res.data.user),
    createTestAccount: () =>
      axios.post("api/users/test-user").then(res => res.data.user),
    checkAuthorized: () =>
      axios
        .get("/api/users/check-authorized", {
          headers: {
            authorization: localStorage.getItem(configuration.JWT_TOKEN_NAME)
          }
        })
        .then(res => res.data.user),
    signout: () =>
      axios.post(
        "/api/users/signout",
        {},
        {
          headers: {
            authorization: localStorage.getItem(configuration.JWT_TOKEN_NAME)
          }
        }
      ),

    addWord: ({ wordId }) =>
      axios.post(
        "/api/users/add-word",
        { wordId },
        {
          headers: {
            authorization: localStorage.getItem(configuration.JWT_TOKEN_NAME)
          }
        }
      )
  },
  word: {
    getDueWords: type =>
      axios
        .get("/api/users/due-words", {
          params: { type },
          headers: {
            authorization: localStorage.getItem(configuration.JWT_TOKEN_NAME)
          }
        })
        .then(res => res.data.words),

    wordResult: ({ wordId, levelChange, type }) =>
      axios.post(
        "/api/users/word-result",
        { wordId, levelChange, type },
        {
          headers: {
            authorization: localStorage.getItem(configuration.JWT_TOKEN_NAME)
          }
        }
      ),

    getWords: ({ query }) =>
      axios.get("/api/words/from-user", {
        params: {
          query
        },
        headers: {
          authorization: localStorage.getItem(configuration.JWT_TOKEN_NAME)
        }
      })
  },
  category: {
    getCategories: () => axios.get("/api/word-categories", { name: "dogs" }),
    getCategory: ({ name }) =>
      axios.get("/api/word-categories/category", {
        headers: {
          authorization: localStorage.getItem(configuration.JWT_TOKEN_NAME)
        },
        params: {
          name
        }
      })
  },
  image: {
    saveImage: ({ bodyFormData }) =>
      axios({
        method: "post",
        url: "/api/images/",
        data: bodyFormData,
        headers: {
          authorization: localStorage.getItem(configuration.JWT_TOKEN_NAME),
          "Content-Type": "multipart/form-data"
        }
      }),
    getImages: ({ imageIds }) =>
      axios.get("/api/images/get-images", { params: { imageIds } })
  }
};

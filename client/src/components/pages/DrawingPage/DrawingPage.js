import React from "react";

import "../../../styles/css/styles.css";
import "./css/DrawingPage.css";

import api from "../../../api";
import Toolbar from "./Toolbar";

class DrawingPage extends React.Component {
  state = {
    width: 400,
    height: 400,
    ratio: 1,
    radius: 10,
    colour: [0, 0, 0],
    tool: "brush",
    prevCanvasDatas: [],
    canvasDataIndex: 0,
    searchBoxOpen: false,
    query: "",
    words: [],
    drawingWords: []
  };

  setColour = colour => {
    this.setState({ colour });
  };

  setSize = radius => {
    this.setState({ radius });
  };

  setTool = tool => {
    this.setState({ tool });
  };

  componentDidMount() {
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext("2d");
    canvas.addEventListener("mousedown", this.onMouseDown, false);
    window.addEventListener("mouseup", this.onMouseUp, false);

    this.setState({ ctx });

    this.resetCanvas();

    const ratio = canvas.clientWidth / canvas.width;

    this.setState({ ratio });
  }

  resetCanvas = () => {
    const canvas = this.refs.canvas;
    canvas.style.height = "auto";
    canvas.style.width = "100%";

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, this.state.width, this.state.height);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, this.state.width, this.state.height);
  };

  onMouseDown = e => {
    e.preventDefault();
    if (!this.state.actionLoop) {
      if (this.state.tool === "brush") {
        this.setState(prevState => {
          let state = prevState;
          state.actionLoop = setInterval(this.paint, 16);
          state = this.addCanvasDataToState(state);
          state.canvasDataIndex++;
          return state;
        });
      } else if (this.state.tool === "bucket") {
        this.setState(prevState => {
          let state = prevState;
          //state = this.addCanvasDataToState(state);
          state.canvasDataIndex++;
          return state;
        });
        this.fill();
      }
    }
  };
  /*onMouseDown = e => {
    e.preventDefault();
    if (this.state.turn && !this.state.actionLoop) {
      if (this.state.tool === "brush") {
        this.setState(prevState => {
          let state = prevState;
          state.actionLoop = setInterval(this.paint, 16);
          state = this.addCanvasDataToState(state);
          state.canvasDataIndex++;
          return state;
        });
      } else if (this.state.tool === "bucket") {
        this.setState(prevState => {
          let state = prevState;
          state = this.addCanvasDataToState(state);
          state.canvasDataIndex++;
          return state;
        });
        this.clientFill();
      }
    }
  };*/

  onMouseUp = e => {
    clearInterval(this.state.actionLoop);
    this.setState({ actionLoop: null, lastX: null, lastY: null });
  };

  paint = () => {
    const { x, y, lastX, lastY, colour, radius } = this.state;

    this.drawCircle(x, y, lastX, lastY, colour, radius);
    this.setState({ lastX: x, lastY: y });
  };

  drawCircle = (x, y, lastX, lastY, colour, radius) => {
    let circleArray = [];
    circleArray.push(radius);

    for (let i = 1; i < radius; i++) {
      let y = Math.sqrt(radius * radius - i * i);
      circleArray.push(Math.round(y));
    }

    const ctx = this.refs.canvas.getContext("2d");

    let canvasData = ctx.getImageData(
      0,
      0,
      this.state.width,
      this.state.height
    );

    for (let i = 0; i < circleArray.length; i++) {
      for (let j = 0; j < circleArray[i]; j++) {
        this.setPixelColour(canvasData.data, x + i, y + j, [
          colour[0],
          colour[1],
          colour[2],
          255
        ]);
        this.setPixelColour(canvasData.data, x + i, y - j, [
          colour[0],
          colour[1],
          colour[2],
          255
        ]);
        this.setPixelColour(canvasData.data, x - i, y + j, [
          colour[0],
          colour[1],
          colour[2],
          255
        ]);
        this.setPixelColour(canvasData.data, x - i, y - j, [
          colour[0],
          colour[1],
          colour[2],
          255
        ]);
      }
    }

    this.drawLineBetweenPoints(x, y, lastX, lastY, colour, radius, canvasData);

    ctx.putImageData(canvasData, 0, 0);
  };

  drawLineBetweenPoints = (x, y, lastX, lastY, colour, radius, canvasData) => {
    //very poorly implemented but i need to just continue and come back later :/
    if (lastX) {
      const alpha = Math.atan((lastY - y) / (lastX - x));
      const beta = Math.PI / 2 - alpha;
      const cosb = radius * Math.cos(beta);
      const sinb = radius * Math.sin(beta);

      const a1 = [Math.round(x - cosb), Math.round(y + sinb)];
      const a2 = [Math.round(lastX - cosb), Math.round(lastY + sinb)];
      const a3 = [Math.round(lastX + cosb), Math.round(lastY - sinb)];
      const a4 = [Math.round(x + cosb), Math.round(y - sinb)];

      let p1 = [],
        p2 = [],
        p3 = [],
        p4 = [];

      // if (a1[0] <)

      if (a1[0] < a2[0] && a1[0] < a3[0] && a1[0] < a4[0]) {
        p1 = a1;
      } else if (a2[0] < a1[0] && a2[0] < a3[0] && a2[0] < a4[0]) {
        p1 = a2;
      } else if (a3[0] < a1[0] && a3[0] < a2[0] && a3[0] < a4[0]) {
        p1 = a3;
      } else p1 = a4;

      if (a1[1] < a2[1] && a1[1] < a3[1] && a1[1] < a4[1]) {
        p2 = a1;
      } else if (a2[1] < a1[1] && a2[1] < a3[1] && a2[1] < a4[1]) {
        p2 = a2;
      } else if (a3[1] < a1[1] && a3[1] < a2[1] && a3[1] < a4[1]) {
        p2 = a3;
      } else p2 = a4;

      if (a1[0] > a2[0] && a1[0] > a3[0] && a1[0] > a4[0]) {
        p3 = a1;
      } else if (a2[0] > a1[0] && a2[0] > a3[0] && a2[0] > a4[0]) {
        p3 = a2;
      } else if (a3[0] > a1[0] && a3[0] > a2[0] && a3[0] > a4[0]) {
        p3 = a3;
      } else p3 = a4;

      if (a1[1] > a2[1] && a1[1] > a3[1] && a1[1] > a4[1]) {
        p4 = a1;
      } else if (a2[1] > a1[1] && a2[1] > a3[1] && a2[1] > a4[1]) {
        p4 = a2;
      } else if (a3[1] > a1[1] && a3[1] > a2[1] && a3[1] > a4[1]) {
        p4 = a3;
      } else p4 = a4;

      //exception for squares

      if (
        a1[0] === a2[0] ||
        a2[1] === a3[1] ||
        a4[0] === a3[0] ||
        a4[1] === a1[1]
      ) {
        const p1 = [x - radius, Math.min(y, lastY)];
        //const p2 = [x + radius, Math.min(y,lastY)];
        const p3 = [x - radius, Math.max(y, lastY)];
        //const p4 = [x + radius, Math.max(y,lastY)];

        for (let i = 0; i < 2 * radius; i++) {
          for (let j = 0; j < p3[1] - p1[1]; j++) {
            this.setPixelColour(canvasData.data, p1[0] + i, p1[1] + j, [
              colour[0],
              colour[1],
              colour[2],
              255
            ]);
          }
        }
      }
      if (
        a1[1] === a2[1] ||
        a2[0] === a3[0] ||
        a4[1] === a3[1] ||
        a4[0] === a1[0]
      ) {
        const p1 = [Math.min(x, lastX), y - radius];
        //const p2 = [x + radius, Math.min(y,lastY)];
        const p3 = [Math.max(x, lastX), y - radius];
        //const p4 = [x + radius, Math.max(y,lastY)];

        for (let i = 0; i < p3[0] - p1[0]; i++) {
          for (let j = 0; j < 2 * radius; j++) {
            this.setPixelColour(canvasData.data, p1[0] + i, p1[1] + j, [
              colour[0],
              colour[1],
              colour[2],
              255
            ]);
          }
        }
      } else {
        //other:

        const m12 = (p1[1] - p2[1]) / (p1[0] - p2[0]);
        const c12 = p1[1] - m12 * p1[0];
        const m23 = (p2[1] - p3[1]) / (p2[0] - p3[0]);
        const c23 = p2[1] - m23 * p2[0];
        const m34 = (p3[1] - p4[1]) / (p3[0] - p4[0]);
        const c34 = p3[1] - m34 * p3[0];
        const m41 = (p4[1] - p1[1]) / (p4[0] - p1[0]);
        const c41 = p4[1] - m41 * p4[0];

        const left = [];

        for (let i = p2[1]; i < p1[1]; i++) {
          const number = Math.round((i - c12) / m12);
          left.push(number);
        }

        for (let i = p1[1]; i <= p4[1]; i++) {
          const number = Math.round((i - c41) / m41);
          left.push(number);
        }

        const right = [];

        for (let i = p2[1]; i < p3[1]; i++) {
          const number = Math.round((i - c23) / m23);
          right.push(number);
        }
        for (let i = p3[1]; i <= p4[1]; i++) {
          const number = Math.round((i - c34) / m34);
          right.push(number);
        }

        for (let i = 0; i < left.length; i++) {
          for (let j = 0; j < right[i] - left[i] + 1; j++) {
            this.setPixelColour(canvasData.data, left[i] + j, p2[1] + i, [
              colour[0],
              colour[1],
              colour[2],
              255
            ]);
          }
        }
      }
    }
  };
  fill = () => {
    const ctx = this.refs.canvas.getContext("2d");

    const { x, y } = this.state;
    const fillColour = this.state.colour;
    const targetColour = ctx.getImageData(x, y, 1, 1).data;
    //const targetColour = [255, 255, 255, 255];

    let canvasData = ctx.getImageData(
      0,
      0,
      this.state.width,
      this.state.height
    );
    const pixelsToCheck = [{ x, y }];
    const pixelsChecked = [];
    pixelsChecked[x + this.state.width * y] = true;

    //let temp = 0;
    while (pixelsToCheck.length > 0) {
      //temp++;
      const dogman = pixelsToCheck.length;
      for (let i = 0; i < dogman; i++) {
        if (
          this.checkPixelColour(
            targetColour,
            pixelsToCheck[0].x,
            pixelsToCheck[0].y,
            canvasData.data
          )
        ) {
          this.setPixelColour(
            canvasData.data,
            pixelsToCheck[0].x,
            pixelsToCheck[0].y,
            fillColour
          );
          this.addSurroundingPixels(pixelsToCheck, pixelsChecked);
        }
        pixelsToCheck.splice(0, 1);
      }

      //if (temp > 1000) break;
    }
    ctx.putImageData(canvasData, 0, 0);
  };

  setPixelColour(canvasData, x, y, colour) {
    const id = 4 * (x + y * this.state.width);
    //if (id < 0 || id + 2 >= canvasData.length) return false;
    if (x >= 0 && y >= 0 && x < this.state.width && y < this.state.height) {
      canvasData[id] = colour[0];
      canvasData[id + 1] = colour[1];
      canvasData[id + 2] = colour[2];
    }
  }

  checkPixelColour = (targetColour, x, y, canvasData) => {
    //returns true if colours are the same
    const id = 4 * (x + y * this.state.width);
    //if (id < 0 || id + 2 >= canvasData.length) return false;
    return (
      canvasData[id] === targetColour[0] &&
      canvasData[id + 1] === targetColour[1] &&
      canvasData[id + 2] === targetColour[2]
    );
  };

  addSurroundingPixels = (pixelsToCheck, pixelsChecked) => {
    const x = pixelsToCheck[0].x,
      y = pixelsToCheck[0].y;

    if (!pixelsChecked[x + 1 + y * this.state.width] && x < this.state.width) {
      pixelsToCheck.push({
        x: x + 1,
        y: y
      });
      pixelsChecked[x + 1 + y * this.state.width] = true;
    }
    if (
      !pixelsChecked[x + (y + 1) * this.state.width] &&
      y < this.state.height
    ) {
      pixelsToCheck.push({
        x: x,
        y: y + 1
      });
      pixelsChecked[x + (y + 1) * this.state.width] = true;
    }
    if (!pixelsChecked[x - 1 + y * this.state.width] && x !== 0) {
      pixelsToCheck.push({
        x: x - 1,
        y: y
      });
      pixelsChecked[x - 1 + y * this.state.width] = true;
    }
    if (!pixelsChecked[x + (y - 1) * this.state.width] && y !== 0) {
      pixelsToCheck.push({
        x: x,
        y: y - 1
      });
      pixelsChecked[x + (y - 1) * this.state.width] = true;
    }
    //return canvasData;
  };

  onMouseMove = e => {
    this.setState({
      x: e.nativeEvent.offsetX / this.state.ratio,
      y: e.nativeEvent.offsetY / this.state.ratio
    });
  };

  setColour = colour => {
    this.setState({ colour });
  };

  setSize = radius => {
    this.setState({ radius });
  };

  setTool = tool => {
    this.setState({ tool });
  };
  resetCanvas = () => {
    const canvas = this.refs.canvas;
    canvas.style.height = "auto";
    canvas.style.width = "100%";

    const ctx = canvas.getContext("2d");

    //ctx.clearRect(0, 0, this.state.width, this.state.height);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, this.state.width, this.state.height);
  };

  addCanvasDataToState = state => {
    //remove everything after the index
    if (state.prevCanvasDatas.length >= state.canvasDataIndex + 1) {
      state.prevCanvasDatas.splice(
        state.canvasDataIndex,
        state.prevCanvasDatas.length - state.canvasDataIndex
      );
    }

    //add it to state
    const ctx = this.refs.canvas.getContext("2d");
    const canvasData = ctx.getImageData(
      0,
      0,
      this.state.width,
      this.state.height
    );
    state.prevCanvasDatas.push(canvasData);

    return state;
  };

  saveImage = () => {
    const canvas = this.refs.canvas;
    const { drawingWords } = this.state;

    const wordIds = [];
    const definitionIds = [];
    for (let i = 0; i < drawingWords.length; i++) {
      wordIds.push(drawingWords[i].wordId);
      if (drawingWords[i].type === "english") definitionIds.push(0);
      else if (drawingWords[i].type === "english2") definitionIds.push(1);
      else if (drawingWords[i].type === "english3") definitionIds.push(2);
    }

    canvas.toBlob(blob => {
      const bodyFormData = new FormData();
      const setFavourite = [];
      for (let i = 0; i < wordIds.length; i++) {
        setFavourite.push(true);
      }

      bodyFormData.set("wordIds", JSON.stringify(wordIds));
      bodyFormData.set("definitionIds", JSON.stringify(definitionIds));
      bodyFormData.set("setFavourite", JSON.stringify(setFavourite));
      bodyFormData.append("image", blob, "image.png");

      api.image
        .saveImage({ bodyFormData })
        .then(response => {
          //handle success
        })
        .catch(function(response) {
          //handle error
        });
    });
  };

  undo = () => {
    const ctx = this.refs.canvas.getContext("2d");

    const { prevCanvasDatas, canvasDataIndex } = this.state;
    this.setState(prevState => {
      let state = prevState;
      //save in case of redo if on last secrtion
      if (prevCanvasDatas.length === canvasDataIndex) {
        state = this.addCanvasDataToState(state);
        console.log("adding a state");
      }
      if (canvasDataIndex > 0) {
        state.canvasDataIndex = canvasDataIndex - 1;
        ctx.putImageData(prevCanvasDatas[canvasDataIndex - 1], 0, 0);
      } /*else {
        ctx.putImageData(prevCanvasDatas[0], 0, 0);
      }*/
      return state;
    });
  };

  redo = () => {
    const ctx = this.refs.canvas.getContext("2d");

    const { prevCanvasDatas, canvasDataIndex } = this.state;
    this.setState(prevState => {
      let state = prevState;

      if (canvasDataIndex + 1 < prevCanvasDatas.length) {
        state.canvasDataIndex = canvasDataIndex + 1;
        ctx.putImageData(prevCanvasDatas[canvasDataIndex + 1], 0, 0);
      }
      /*else {
        ctx.putImageData(prevCanvasDatas[0], 0, 0);
      }*/
      return state;
    });
  };

  //modal search stuff
  handleCloseSearch = () => {
    this.setState({ searchBoxOpen: false });
  };

  handleOpenSearch = () => {
    this.setState({ searchBoxOpen: true });
  };

  handleSearch = e => {
    e.preventDefault();
    const { query } = this.state;
    api.word.getWords({ query }).then(res => {
      this.setState({ words: res.data.words });
    });
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleAddDrawingWord = (index, type) => {
    this.setState(prevState => {
      const state = { ...prevState };
      state.drawingWords.push({
        french: state.words[index].french,
        english: state.words[index][type],
        wordId: state.words[index]._id,
        type
      });
      return state;
    });

    this.handleCloseSearch();
  };

  render() {
    const { searchBoxOpen, query, words, drawingWords } = this.state;

    return (
      <div>
        <div
          className="container full-container drawing-page-container"
          style={{
            width: "100%"
          }}
        >
          <div className="row">
            <div className="col-3">
              <div id="canvas-div" style={{ width: 200, height: 200 }}>
                <canvas
                  className="shadow "
                  ref="canvas"
                  onMouseMove={this.onMouseMove}
                  width={200}
                  height={200}
                />
              </div>
            </div>
            <div className="col-9">
              <div className="container">
                <div
                  className="modal"
                  id="myModal"
                  role="dialog"
                  tabindex="-1"
                  style={
                    searchBoxOpen ? { display: "block" } : { display: "none" }
                  }
                >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h4 className="modal-title">Search for a word</h4>
                      </div>
                      <div className="modal-body">
                        <form onSubmit={this.handleSearch}>
                          <div className="search-bar-outer">
                            <div className="search-bar-inner">
                              <input
                                class="form-control search-page-search-bar"
                                placeholder="Search Words"
                                name="query"
                                type="text"
                                value={query}
                                onChange={this.handleChange}
                              />
                            </div>
                          </div>
                        </form>

                        <div className="row search-page-titles">
                          <div className="col-3">
                            <p>French</p>
                          </div>
                          <div className="col-3">
                            <p>English (1)</p>
                          </div>
                          <div className="col-3">
                            <p>English (2)</p>
                          </div>
                          <div className="col-3">
                            <p>English (3)</p>
                          </div>
                        </div>

                        {words.map((word, index) => (
                          <div className="row">
                            <div className="col-3">
                              <p>{word.french}</p>
                            </div>
                            <div className="col-3">
                              <p
                                className="btn btn-link"
                                onClick={() =>
                                  this.handleAddDrawingWord(index, "english")
                                }
                              >
                                {word.english}
                              </p>
                            </div>
                            <div className="col-3">
                              <p
                                className="btn btn-link"
                                onClick={() =>
                                  this.handleAddDrawingWord(index, "english2")
                                }
                              >
                                {word.english2}
                              </p>
                            </div>
                            <div className="col-3">
                              <p
                                className="btn btn-link"
                                onClick={() =>
                                  this.handleAddDrawingWord(index, "english3")
                                }
                              >
                                {word.english3}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-default"
                          onClick={this.handleCloseSearch}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div id="drawing-page-info">
                <button
                  type="button"
                  className="btn btn-info"
                  onClick={this.handleOpenSearch}
                >
                  Select Word to Draw
                </button>
                <div>
                  English:{" "}
                  {drawingWords[0]
                    ? drawingWords[0].english
                    : "No word selected"}
                </div>
                <div>
                  French:{" "}
                  {drawingWords[0]
                    ? drawingWords[0].french
                    : "No word selected"}
                </div>
                <div>
                  <button
                    type="button"
                    className="btn btn-info"
                    onClick={this.saveImage}
                  >
                    Save image!
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="float-none">
            <Toolbar
              setSize={this.setSize}
              setColour={this.setColour}
              setTool={this.setTool}
              resetCanvas={this.resetCanvas}
              undo={this.undo}
              redo={this.redo}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default DrawingPage;

import React from "react";

function ResponseButtons(props) {
  return (
    <table>
      <tr>
        <td>
          <button
            className="btn difficulty-btn btn-1"
            onClick={() => props.handleResponse(1)}
          >
            1
          </button>
          <p>Wrong</p>
        </td>
        <td>
          <button
            className="btn difficulty-btn btn-2"
            onClick={() => props.handleResponse(2)}
          >
            2
          </button>
          <p>Hard</p>
        </td>
        <td>
          <button
            className="btn difficulty-btn btn-3"
            onClick={() => props.handleResponse(3)}
          >
            3
          </button>
          <p>Right</p>
        </td>
        <td>
          <button
            className="btn difficulty-btn btn-4"
            onClick={() => props.handleResponse(4)}
          >
            4
          </button>
          <p>Easy</p>
        </td>
      </tr>
    </table>
  );
}

export default ResponseButtons;

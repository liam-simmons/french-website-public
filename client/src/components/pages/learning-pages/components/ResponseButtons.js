import React from "react";

function ResponseButtons(props) {
  return (
    <table>
      <tr>
        <td>
          <button
            className="btn btn-theme btn-1 difficulty-btn"
            onClick={() => props.handleResponse(1)}
          >
            1
          </button>
          <p>Wrong</p>
        </td>
        <td>
          <button
            className="btn btn-theme btn-2 difficulty-btn"
            onClick={() => props.handleResponse(2)}
          >
            2
          </button>
          <p>Hard</p>
        </td>
        <td>
          <button
            className="btn btn-theme btn-3 difficulty-btn"
            onClick={() => props.handleResponse(3)}
          >
            3
          </button>
          <p>Right</p>
        </td>
        <td>
          <button
            className="btn btn-theme btn-4 difficulty-btn"
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

//old button class: difficulty-btn

export default ResponseButtons;

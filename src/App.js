import "bootstrap/dist/css/bootstrap.min.css";
import Ganesha from "./Ganesh.jpg";
import React, { useState, useEffect } from "react";
import "./app.css";
import env from "react-dotenv";

let DB_URL = env.DB_SERVER_URL;

function App() {
  const [message, setMessage] = useState("");
  const [disableButton, setDisableButton] = useState(true);
  const [showLoading, setShowLoading] = useState(true);
  const [suggestionsRes, setSuggestionsRes] = useState([]);
  let placeHolderMessage = `Enter your suggestion here and click Submit!\nYou don't have to enter your name, your suggestion will be completely anonymous!!`;

  useEffect(() => {
    async function getRecords() {
      try {
        const response = await fetch(`${DB_URL}/ganesh23suggestions`);
        // http://localhost:5000/ganesh23suggestions`);

        if (!response.ok) {
          const message = `An error occurred: ${response.statusText}`;
          window.alert(message);
          return;
        }
        const resBody = await response.json();
        setSuggestionsRes(resBody);
      } catch (error) {
        console.log("Error", error);
        window.alert(
          "Could not load suggestions right now. Please try again later!"
        );
      }
    }
    setShowLoading(false);
    getRecords();
    // eslint-disable-next-line
  }, []);

  async function submitResponse(e) {
    e.preventDefault();
    const payload = {
      message: message,
    };
    if (payload.message === "") {
      window.alert("Please enter a message to Submit!");
      setMessage("");
      return;
    }
    const response = await fetch(
      `http://localhost:5000/ganesh23/addsuggestion`,
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const message = `An error occurred: ${response.statusText}`;
      window.alert(message);
      return;
    }

    if (response.ok) {
      setMessage("");
      document.getElementById("suggestion-textarea").value = "";
      window.alert("Suggestion submitted successfully");
      window.location.reload(false);
    }
  }

  const setMessageOnChange = (e, name) => {
    if (e.target.value != null) {
      setMessage(name);
      setDisableButton(false);
      // return;
    }
  };

  const renderSuggestionsFromAPI = (items) => {
    if (showLoading) {
      return (
        <div align={"center"}>
          <div className="loader"></div>
        </div>
      );
    }
    return (
      <>
        {items.map((suggestion) => (
          <div className="suggestions-from-api m-auto pb-2">
            <div className="card p">
              <div className="card-body">
                <p className="card-text fw-bold">{suggestion.timestamp}</p>
                <hr />
                <p>{suggestion.message}</p>
              </div>
            </div>
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="App d-flex flex-column">
      {/* <nav className="navbar navbar-expand-sm navbar-dark bg-dark position-fixed"> */}
      <div className="d-flex justify-content-center bg-dark p-2">
        <img
          src={Ganesha}
          width="50"
          height="50"
          className="rounded-circle"
          alt="Ganesha"
        />
        <div className="headings">
          <h3 className="text-white ps-5">Mpl Ganesh 2023 Suggestions</h3>
          <text className="text-white ps-5 ">Developed by Vikram Reddy😎</text>
        </div>
      </div>
      {/* </nav> */}
      <br />
      <div className="suggestions-list position-relative">
        <h3 className="fw-bolder text-center">All suggestions</h3>
        <div className="">{renderSuggestionsFromAPI(suggestionsRes)}</div>
      </div>
      <div className="fixed-bottom">
        <div className="form-group">
          <div className="fw-bold p-2" for="exampleFormControlTextarea1">
            Your Suggestion:
          </div>
          <textarea
            placeholder={placeHolderMessage}
            id="suggestion-textarea"
            onChange={(event) => setMessageOnChange(event, event.target.value)}
            className="form-control border border-dark"
            rows="3"
          ></textarea>
          <button
            disabled={disableButton}
            type="button"
            className="btn btn-success col-12"
            onClick={submitResponse}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

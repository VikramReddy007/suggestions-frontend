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
        setShowLoading(false);
      } catch (error) {
        console.log("Error", error);
        window.alert(
          "Could not load suggestions right now. Please try again later!"
        );
        setShowLoading(true);
      }
    }
    
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
      `${DB_URL}/ganesh23/addsuggestion`,
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
      sendWhatsappMsg();
      window.alert("Suggestion submitted successfully");
      window.location.reload(false);
    }
  }

  const sendWhatsappMsg = (async) => {
    const apiKey = env.VONAGE_API_KEY;
    const apiSecret = env.VONAGE_API_SECRET;

    const apiUrl = 'https://messages-sandbox.nexmo.com/v1/messages';

    // Data for the POST request
    const postData = {
      from: '14157386102',
      to: '919533943973',
      message_type: 'text',
      text: message,
      channel: 'whatsapp'
    };

    // Create the HTTP headers
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      "Access-Control-Allow-Origin": "*",
      // "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
      'Authorization': `Basic ${btoa(`${apiKey}:${apiSecret}`)}`
    });

    // Create the request options
    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(postData)
    };

    // Send the POST request
    fetch(apiUrl, requestOptions)
      .then(response =>{
        response.json();
      })
      .then(data => {
        // Handle the response data here
        // this.setState({ response: data, error: null });
      })
      .catch(error => {
        // Handle errors
        window.alert('error:  '+error);
        // this.setState({ response: null, error: error.message });
      });
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
      <div className="">
        {items.map((suggestion) => (
          <div className="suggestions-from-api m-auto mb-2">
            <div className="card ps-1">
              <div className="card-body">
                <p className="card-text fw-bold">{suggestion.timestamp}</p>
                <hr />
                <p>{suggestion.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
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

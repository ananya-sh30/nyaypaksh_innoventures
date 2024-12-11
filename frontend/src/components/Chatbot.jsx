import React, { useState, useRef, useEffect } from "react";
import "../styles/Summary.css";
import logo from "../assets/bot-logo.png";

function Chatbot({ originalText }) {
  const [chatHistory, setChatHistory] = useState([]);
  const [userQuestion, setUserQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatboxRef = useRef(null);

  // Display greeting message when the chatbot loads
  useEffect(() => {
    setChatHistory([
      { role: "bot", content: "Greetings Your Honor! How can I assist you with the case today?" },
    ]);
  }, []);

  const handleAskQuestion = async () => {
    if (!userQuestion.trim()) return;

    setIsLoading(true); // Show loading indicator
    console.log("Sending question:", userQuestion);

    // Add the user's question to the chat history
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { role: "user", content: userQuestion },
    ]);

    try {
      const response = await fetch("http://localhost:5001/api/chatbot/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userQuestion,
          context: originalText,
        }),
      });

      const data = await response.json();
      console.log("Response data:", data);

      if (data.answer) {
        setChatHistory((prevHistory) => [
          ...prevHistory,
          { role: "bot", content: data.answer },
        ]);
      } else {
        setChatHistory((prevHistory) => [
          ...prevHistory,
          { role: "bot", content: "Sorry, I couldn't find an answer." },
        ]);
      }
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { role: "bot", content: "Error processing your request. Please try again." },
      ]);
    }

    setUserQuestion(""); // Clear user input
    setIsLoading(false); // Hide loading indicator
  };

  // Auto-scroll to the bottom of the chatbox whenever chatHistory changes
  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className="chatbot-containerrr">
      <div className="chatbox" ref={chatboxRef}>
        {chatHistory.map((message, index) => (
          <div className="msgbot" key={index}>
            {message.role === "bot" && (
              <img
                src={logo} // Replace with the path to your bot image
                alt="Bot Icon"
                className="bot-icon"
              />
            )}
            <div className={message.role === "user" ? "user-message" : "bot-message"}>
              <div className="message-with-icon">
                <p>{message.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={userQuestion}
          onChange={(e) => setUserQuestion(e.target.value)}
          placeholder="Ask a question about the document..."
        />
        <button onClick={handleAskQuestion} disabled={isLoading}>
          {isLoading ? "Thinking..." : <i className="bx bxs-send"></i>}
        </button>
      </div>
    </div>
  );
}

export default Chatbot;

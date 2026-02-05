import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import './App.css';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I am the hotel AI assistant. Ask me about rooms, food, or check-in times!", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Hotel Context - This tells the AI how to behave
      const hotelContext = `
        You are a helpful concierge at "Grand Horizon Hotel".
        
        Hotel Details:
        - Single Room: ₹1000 (Non-AC), ₹1500 (AC).
        - Double Room: ₹2000 (Non-AC), ₹2500 (AC).
        - Suite: ₹5000 (Luxury).
        - Food: We serve Biryani, Pizza, Burgers, and cool drinks.
        - Location: Hyderabad, Telangana.
        - Check-in: 12 PM | Check-out: 11 AM.
        
        Keep answers short (under 40 words) and polite.
      `;

      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro"});
      const prompt = `${hotelContext}\n\nGuest: ${input}\nConcierge:`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { text: text, isBot: true }]);

    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, { text: "I'm having trouble connecting. Please try again.", isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "✕" : "💬"}
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>Hotel Assistant</h3>
          </div>
          
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.isBot ? 'bot' : 'user'}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && <div className="message bot">Thinking...</div>}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input-area">
            <input 
              type="text" 
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;
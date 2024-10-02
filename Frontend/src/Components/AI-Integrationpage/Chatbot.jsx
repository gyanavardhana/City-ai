import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown'; // Import the markdown library

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Toggle chat window
  const toggleChat = (e) => {
    if (e.target.closest('.chatbot-toggle-btn')) {
      setIsOpen(!isOpen);
    }
  };

  // Prevent toggling when clicking inside the chat window
  const preventToggle = (e) => {
    e.stopPropagation();
  };

  // Handle input change
  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    // Update chat history with user prompt
    setChatHistory([...chatHistory, { role: 'user', text: prompt }]);
    setLoading(true);

    // Call the API with axios
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_URL}generate`, { prompt });

      if (response.data.response) {
        setChatHistory((prev) => [
          ...prev,
          { role: 'user', text: prompt },
          { role: 'ai', text: response.data.response },
        ]);
      } else {
        setChatHistory((prev) => [
          ...prev,
          { role: 'user', text: prompt },
          { role: 'ai', text: 'Sorry, something went wrong.' },
        ]);
      }
    } catch (error) {
      console.error('Error calling the API:', error);
      setChatHistory((prev) => [
        ...prev,
        { role: 'user', text: prompt },
        { role: 'ai', text: 'Error occurred!' },
      ]);
    } finally {
      setLoading(false);
      setPrompt(''); // Clear input
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating Circle Button */}
      <div
        className={`chatbot-toggle-btn flex items-center justify-center w-16 h-16 bg-cyan-500 rounded-full cursor-pointer transition-all duration-300 ${
          isOpen ? 'w-80 h-96' : ''
        }`}
        onClick={toggleChat}
      >
        {!isOpen ? (
          <span className="text-2xl text-white">💬</span>
        ) : (
          <div
            className="relative flex flex-col h-full w-full bg-white rounded-lg shadow-lg"
            onClick={preventToggle} // Prevent closing when interacting with the chat
          >
            {/* Chat Header */}
            <div className="flex justify-between items-center p-4 bg-cyan-500 text-white rounded-t-lg">
              <h4 className="text-lg font-bold">AI Chatbot</h4>
              <button
                className="text-2xl font-bold focus:outline-none"
                onClick={toggleChat}
              >
                ×
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-2">
              {chatHistory.map((message, index) => (
                <div
                  key={index}
                  className={`${
                    message.role === 'user'
                      ? 'self-end bg-blue-500 text-white'
                      : 'self-start bg-gray-200 text-black'
                  } p-2 rounded-lg max-w-xs`}
                >
                  {/* Render Markdown content */}
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                </div>
              ))}
              {loading && <div className="text-gray-500">AI is thinking...</div>}
            </div>

            {/* Chat Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center p-2 border-t border-gray-300"
            >
              <input
                type="text"
                placeholder="Type your question..."
                value={prompt}
                onChange={handlePromptChange}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none"
                disabled={loading}
              />
              <button
                type="submit"
                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
                disabled={loading}
              >
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;

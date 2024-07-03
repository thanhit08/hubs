import React, { useState, useEffect } from 'react';
import styles from './AITeacherSidebar.scss';

export function AITeacherSidebar() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const sendMessage = () => {
    };
    return (
        <div className="chat-container">
            <div className="message-list">
                {messages.map((msg, index) => (
                    <div key={index} className="message">
                        {msg}
                    </div>
                ))}
            </div>
            <div className="input-area">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

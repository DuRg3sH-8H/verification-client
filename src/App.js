import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [inputs, setInputs] = useState(Array(6).fill(''));
  const [error, setError] = useState('');

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/^[0-9]?$/.test(value)) {
      const newInputs = [...inputs];
      newInputs[index] = value;
      setInputs(newInputs);

      if (value && index < 5) {
        document.getElementById(`input-${index + 1}`).focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 6);
    if (/^[0-9]{1,6}$/.test(pasteData)) {
      const newInputs = pasteData.split('');
      const updatedInputs = [...inputs];
      newInputs.forEach((char, i) => {
        updatedInputs[i] = char;
      });
      setInputs(updatedInputs);
      const lastFilledIndex = newInputs.length - 1;
      if (lastFilledIndex < 5) {
        document.getElementById(`input-${lastFilledIndex + 1}`).focus();
      } else {
        document.getElementById(`input-5`).blur();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !inputs[index] && index > 0) {
      document.getElementById(`input-${index - 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = inputs.join('');
    if (code.length !== 6) {
      setError('Please fill in all inputs.');
      return;
    }
    try {
      const response = await axios.post('verification-api-production.up.railway.app:8080/verify', { code });
      if (response.status === 200) {
        window.location.href = '/success';
      }
    } catch (err) {
      setError('Verification Error');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-5 bg-white shadow-md rounded-md max-w-sm w-full mx-auto">
        <h1 className="text-lg font-bold mb-4 text-center">Verification Code:</h1>
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <div className="flex space-x-2 mb-4">
          {inputs.map((input, index) => (
            <input
              key={index}
              id={`input-${index}`}
              type="text"
              value={input}
              onChange={(e) => handleChange(e, index)}
              onPaste={handlePaste}
              onKeyDown={(e) => handleKeyDown(e, index)}
              maxLength="1"
              className="w-12 h-12 text-center text-lg border border-black rounded"
            />
          ))}
        </div>
        {error && <div className="text-red-500 mt-2">{error}</div>}
        <button
          type="submit"
          className="w-[240px] py-2 mt-1 bg-blue-950 text-white font-semibold rounded-md"
        >
          SUBMIT
        </button>
      </form>

      </div>
    </div>
  );
}

export default App;

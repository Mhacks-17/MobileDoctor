import React, { useEffect, useRef, useState } from 'react';

const WebcamCapture = () => {
  const videoRef = useRef(null);
  const [result, setResult] = useState(null);
  const [textInput, setTextInput] = useState(''); // State for the text input

  useEffect(() => {
    // Access the webcam on mount
    async function startWebcam() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing webcam: ', err);
      }
    }
    startWebcam();
  }, []);

  const captureFrame = async () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageBase64 = canvas.toDataURL('image/png'); // Convert canvas to base64 image

      // Convert base64 to Blob for file upload
      const byteString = atob(imageBase64.split(',')[1]); // Decode base64
      const mimeString = imageBase64.split(',')[0].split(':')[1].split(';')[0]; // Extract MIME type
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });

      const formData = new FormData();
      formData.append('file', blob, 'capture.png'); // Append the Blob as a file
      formData.append('textInput', textInput); // Append the text input

      // Send the frame as a POST request to the API
      fetch('http://localhost:8000/pharmacy/', {
        method: 'POST',
        body: formData, // Use FormData to send the file
      })
        .then((response) => response.json())
        .then((data) => {
          setResult(data.result); // Set result (true/false) from the API response
        })
        .catch((error) => {
          console.error('Error:', error);
        });

      console.log("Frame captured and sent to API");
    }
  };

  return (
    <div 
      style={{ textAlign: 'center', padding: '20px' }} 
      onClick={captureFrame} // Capture frame on click
    >
      <h1>AI Pharmasict</h1>
      
      {/* Text input at the top */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", marginBottom: "20px" }}>
      <input
        type="text"
        placeholder="Enter text..."
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        onFocus={(e) => (e.target.style.borderColor = "#00796b")}
        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
        style={{
          width: "300px",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          fontSize: "16px",
          outline: "none",
          transition: "border-color 0.3s ease, box-shadow 0.3s ease",
        }}
      />
    </div>

      {/* Show the result of the POST request */}
      {result !== null && (
        <h2 style={{ marginTop: '20px', color: result ? 'green' : 'red' }}>
          Result: {result}
        </h2>
      )}

      <video ref={videoRef} autoPlay style={{ width: '100%', height: 'auto', marginBottom: '20px' }} />
    </div>
  );
};

export default WebcamCapture;

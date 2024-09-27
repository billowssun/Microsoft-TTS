import React, { useState } from 'react';
import axios from 'axios';

const TTSForm = () => {
    const [apiKey, setApiKey] = useState('');
    const [text, setText] = useState('');
    const [voice, setVoice] = useState('en-US-AriaNeural');
    const [speed, setSpeed] = useState('1.0');
    const [audioSrc, setAudioSrc] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted');
        const url = 'https://<your-region>.tts.speech.microsoft.com/cognitiveservices/v1';
        const headers = {
            'Ocp-Apim-Subscription-Key': apiKey,
            'Content-Type': 'application/ssml+xml',
            'X-Microsoft-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3'
        };
        const data = `
            <speak version='1.0' xml:lang='en-US'>
                <voice xml:lang='en-US' xml:gender='Female' name='${voice}'>
                    <prosody rate='${speed}'>${text}</prosody>
                </voice>
            </speak>
        `;

        try {
            console.log('Sending request to:', url);
            console.log('Request headers:', headers);
            console.log('Request data:', data);
            const response = await axios.post(url, data, { headers, responseType: 'arraybuffer' });
            console.log('Response received:', response);
            const audioBlob = new Blob([response.data], { type: 'audio/mp3' });
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudioSrc(audioUrl);
        } catch (error) {
            console.error('Error generating speech:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>API Key:</label>
                    <input type="text" value={apiKey} onChange={(e) => setApiKey(e.target.value)} required />
                </div>
                <div>
                    <label>Text:</label>
                    <textarea value={text} onChange={(e) => setText(e.target.value)} required />
                </div>
                <div>
                    <label>Voice:</label>
                    <select value={voice} onChange={(e) => setVoice(e.target.value)}>
                        <option value="en-US-AriaNeural">Aria (en-US)</option>
                        <option value="en-US-GuyNeural">Guy (en-US)</option>
                        <!-- Add more voices as needed -->
                    </select>
                </div>
                <div>
                    <label>Speed:</label>
                    <input type="number" step="0.1" value={speed} onChange={(e) => setSpeed(e.target.value)} />
                </div>
                <button type="submit">Generate Speech</button>
            </form>
            {audioSrc && <audio controls src={audioSrc} />}
        </div>
    );
};

export default TTSForm;
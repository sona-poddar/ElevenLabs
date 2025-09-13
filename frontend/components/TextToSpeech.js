// import { useState, useEffect, useRef } from 'react';

// export default function TextToSpeech() {
//   const [audioMap, setAudioMap] = useState(null);
//   const [lang, setLang] = useState('english');
//   const audioRef = useRef(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     async function fetchUrls() {
//       try {
//         const res = await fetch(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/audio-urls/');
//         const json = await res.json();
//         setAudioMap(json);
//       } catch (err) {
//         console.error('Failed to fetch audio urls', err);
//       }
//     }
//     fetchUrls();
//   }, []);

//   const play = async () => {
//     if (!audioMap) return;
//     const url = audioMap[lang];
//     if (!url) return;
//     setLoading(true);
//     if (audioRef.current) audioRef.current.pause();
//     audioRef.current = new Audio(url);
//     audioRef.current.onended = () => setLoading(false);
//     audioRef.current.onerror = () => setLoading(false);
//     try { await audioRef.current.play(); } catch (e) { console.error('play failed', e); setLoading(false);}  };

//   const download = () => {
//     if (!audioMap) return;
//     const url = audioMap[lang];
//     if (!url) return;
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `${lang}.mp3`;
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//   };

//   return (
//     <div className="tts-card\">
//       <div className="tabs\">
//         <button className="tab active\">Text to Speech</button>
//         <button className="tab\">Agents</button>
//         <button className="tab\">Music</button>
//         <button className="tab\">Speech to Text</button>
//         <button className="tab\">Dubbing</button>
//         <button className="tab\">Voice Cloning</button>
//         <button className="tab\">ElevenReader</button>
//       </div>
//       <div className="editor\">
//         <textarea defaultValue={`In the ancient land of Eldoria, where skies shimmered and forests, whispered secrets to the wind, lived a dragon named Zephyros. Not the \"burn it all down\" kind... but he was gentle, wise, with eyes like old stars.`}></textarea>
//       </div>
//       <div className="controls\">
//         <div className="left\">
//           <select value={lang} onChange={(e) => setLang(e.target.value)}>
//             <option value="english\">English</option>
//             <option value="arabic\">Arabic</option>
//           </select>
//         </div>
//         <div className="right\">
//           <button className="icon\" onClick={play}>{loading ? 'Loading...' : 'Play ▶'}</button>
//           <button className="icon\" onClick={download}>Download ⤓</button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect, useRef } from 'react';

export default function TextToSpeech() {
  const [audioMap, setAudioMap] = useState(null);
  const [lang, setLang] = useState('english');
  const langMap = {
  english: 'en',
  arabic: 'ar',
  french: 'fr',
  spanish: 'es',
  hindi: 'hi',
};
  const audioRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchUrls() {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/audio-urls/');
        const json = await res.json();
        setAudioMap(json);
        console.log("Fetched audio map:", json); // 👀 Debug
      } catch (err) {
        console.error('Failed to fetch audio urls', err);
      }
    }
    fetchUrls();
  }, []);

  const play = async () => {
  if (!audioRef.current) audioRef.current = new Audio();

  setLoading(true);
  try {
    const formData = new FormData();
    formData.append("text", document.querySelector("textarea").value);
    formData.append("lang", langMap[lang]);


    const res = await fetch("http://localhost:8000/api/generate-audio/", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Failed to generate audio");

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    audioRef.current.src = url;
    await audioRef.current.play();
  } catch (err) {
    console.error("play failed", err);
  } finally {
    setLoading(false);
  }
};


  const download = async () => {
  setLoading(true);
  try {
    const formData = new FormData();
    formData.append("text", document.querySelector("textarea").value);
     formData.append("lang", langMap[lang]);
    const res = await fetch("http://localhost:8000/api/generate-audio/", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Failed to generate audio");

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${lang}.mp3`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url); // cleanup
  } catch (err) {
    console.error("download failed", err);
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="tts-card">
      <div className="tabs">
        <button className="tab active">Text to Speech</button>
        <button className="tab">Agents</button>
        <button className="tab">Music</button>
        <button className="tab">Speech to Text</button>
        <button className="tab">Dubbing</button>
        <button className="tab">Voice Cloning</button>
        <button className="tab">ElevenReader</button>
      </div>
      <div className="editor">
        <textarea defaultValue={`In the ancient land of Eldoria, where skies shimmered and forests whispered secrets to the wind, lived a dragon named Zephyros. Not the "burn it all down" kind... but he was gentle, wise, with eyes like old stars.`}></textarea>
      </div>
      <div className="controls">
        <div className="left">
          <select value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="english">English</option>
            <option value="arabic">Arabic</option>
            <option value="french">French</option>
            <option value="spanish">Spanish</option>
            <option value="hindi">Hindi</option>
          </select>
        </div>
        <div className="right">
          <button className="icon" onClick={play}>{loading ? 'Loading...' : 'Play ▶'}</button>
          <button className="icon" onClick={download}>Download ⤓</button>
        </div>
      </div>
    </div>
  );
}

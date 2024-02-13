"use client";
import { emotionStyles } from "./emotions";
import { useDebouncedCallback } from "use-debounce";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [emoji, setEmoji] = useState({ label: "", score: 0 });
  const [style, setStyle] = useState({emoji: "", bgColor: "bg-white"})

  const handleInputChange = useDebouncedCallback(async (value) => {
    setInput(value);
    if (value.trim() !== "") {
      await runPrediction(value);
    }
  }, 1000);


  async function runPrediction(input: string) {
    const result = await axios.post("api/emotion", { input });
    const detectedEmotion = result.data.filterEmotions[0]
    setEmoji(detectedEmotion)
    updateUIbasedOnEmotion(detectedEmotion.label)
  }

  return (
<main className={`flex items-center flex-col p-24 min-h-screen gap-4 ${style.bgColor}`}>
      <h1 className="text-2xl ">🧑‍🎨 Show my mood 🧹</h1>
      <div className="w-full max-w-lg px-4">
        <textarea
          onChange={(e) => handleInputChange(e.target.value)}
          className="border-2 border-zinc-700 rounded-lg p-4 w-full resize-none"
          placeholder="Tell me how you fell today . . ."
        ></textarea>
      </div>
      <p>{">" + input}</p>
      <div>
        <span>You feel {emoji.label}{style.emoji}</span>
      </div>
    </main>
  );
  type EmotionLabel = keyof typeof emotionStyles;
  
  function updateUIbasedOnEmotion(label: EmotionLabel) {
      const emotionStyle = emotionStyles[label] || { emoji: "❓", bgColor: "bg-white" };
      setStyle(emotionStyle)
      console.log(style);
      
  }

}  

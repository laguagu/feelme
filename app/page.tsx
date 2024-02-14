"use client";
import { motion, useScroll } from "framer-motion";
import { emotionStyles } from "./emotions";
import { useDebouncedCallback } from "use-debounce";
import { useState } from "react";
import Lorem from "@/components/lorem";
import axios from "axios";
import { Oval } from "react-loader-spinner";

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [emoji, setEmoji] = useState({ label: "", score: 0 });
  const [style, setStyle] = useState({ emoji: "", bgColor: "bg-white" });
  const [rows, setRows] = useState(2);
  const [loading, setLoading] = useState(false);
  const [tagVisible, setTagVisible] = useState(false);

  const { scrollYProgress } = useScroll();

  const handleInputChange = useDebouncedCallback(async (event) => {
    // // Ei toimi oikein rivien lisääminen debouncen takia ilmeisesti?
    // const lineHeight = 20;
    // const newRows = Math.max(1, Math.max(1, Math.ceil(event.target.scrollHeight / lineHeight)));
    // // Aseta rivien uusi määrä
    // setRows(newRows);
    const inputValue = event.target.value;
    setInput(inputValue);
    if (inputValue.trim() !== "") {
      await runPrediction(inputValue);
    }
  }, 1000);

  async function runPrediction(input: string) {
    setTagVisible(false);
    setLoading(true);
    const result = await axios.post("api/emotion", { input });
    const detectedEmotion = result.data.filterEmotions[0];
    setEmoji(detectedEmotion);
    updateUIbasedOnEmotion(detectedEmotion.label);
    setLoading(false);
    setTagVisible(true);
  }

  return (
    <>
      <motion.div
        className="progress-bar"
        style={{ scaleX: scrollYProgress }}
      />
      <main
        className={`transition-all bg-opacity-60 delay-1000 flex items-center flex-col p-24 min-h-screen gap-4 ${style.bgColor}`}
      >
        <h1 className="text-2xl ">🧑‍🎨 Show my mood 🧹</h1>
        <div className="w-full max-w-lg px-4">
          <textarea
            rows={rows}
            onChange={(e) => handleInputChange(e)}
            className="border-2 border-zinc-700 rounded-lg p-4 w-full resize-none"
            placeholder="Tell me how you fell today . . ."
          ></textarea>
        </div>
        <p>{">" + input}</p>
        <div className="flex flex-wrap items-center justify-center">
          {loading ? (
            renderSpinner()
          ) : (
            <span
              style={{ opacity: tagVisible ? 1 : 0 }}
              className="bg-indigo-300 transition-all rounded-lg p-2 opacity-90 border border-black"
            >
              You feel {emoji.label}
              {style.emoji}
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-center align-middle text-center"></div>
      </main>
    </>
  );
  type EmotionLabel = keyof typeof emotionStyles;

  function updateUIbasedOnEmotion(label: EmotionLabel) {
    const emotionStyle = emotionStyles[label] || {
      emoji: "❓",
      bgColor: "bg-white",
    };
    setStyle(emotionStyle);
  }
  function renderSpinner() {
    return (
      <div className="flex items-center justify-center w-full h-full transition-all">
        <Oval
          visible={true}
          height="40"
          width="40"
          color="#4fa94d"
          ariaLabel="line-wave-loading"
        />
      </div>
    );
  }
}

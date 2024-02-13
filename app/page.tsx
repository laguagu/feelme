"use client";
import { useDebouncedCallback } from "use-debounce";
import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [input, setinput] = useState<string>("");

  const handleInputChange = useDebouncedCallback((term) => {
    setinput(term);
    runPrediction(input);
    return () => setinput("");
  }, 1000);

  async function runPrediction(input: string) {
    const result = await axios.post("api/emotion", { input });
    console.log(result);
  }

  return (
    <main className="flex items-center flex-col p-24 min-h-screen gap-4">
      <h1 className="text-2xl ">🧑‍🎨 Show my mood 🧹</h1>
      <div className="w-full max-w-lg px-4">
        <textarea
          onChange={(e) => handleInputChange(e.target.value)}
          className="border-2 border-zinc-700 rounded-lg p-4 w-full resize-none"
          placeholder="Tell me how you fell today . . ."
        ></textarea>
      </div>
      <p>{">" + input}</p>
    </main>
  );
}

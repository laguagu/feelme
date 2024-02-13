import { HfInference, TextClassificationOutput } from "@huggingface/inference";
const hf = new HfInference(process.env.HUGGIGN_FACE);

export async function POST(request: Request, response: Response) {
  const { input } = await request.json();
  const inferenceResult: TextClassificationOutput = await inference(input);
  const filterEmotions = await filteredEmotion([...inferenceResult])
  console.log(inferenceResult);
  console.log(filterEmotions);

  return new Response("Moikka", { status: 200 });
}

async function inference(input: string) {
  const model = "SamLowe/roberta-base-go_emotions";
  const hfresult = await hf.textClassification({
    model: model,
    inputs: input,
  });
  return hfresult;
}

async function filteredEmotion(emotions:TextClassificationOutput) {
    if (!emotions || emotions.length === 0) return [];
    const firstEmotionScore = emotions[0].score;
    return emotions.filter(emotion => emotion.score >= firstEmotionScore * 0.5);
}

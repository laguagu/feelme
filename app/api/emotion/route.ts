import { HfInference } from "@huggingface/inference";
const hf = new HfInference();

export async function POST(request: Request, response: Response) {
  const { input } = await request.json();
  const inferenceResult = await inference(input);
  console.log(inferenceResult);

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

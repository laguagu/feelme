export async function runPrediction(inputText: string) {
  const apiUrl = "/api/emotion";

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: inputText }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const responseData = await response.text();
    console.log(responseData);

    return responseData; // Palauttaa vastauksen suoraan
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    throw error; // Heittää virheen kutsujalle
  }
}

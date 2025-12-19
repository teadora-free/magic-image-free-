
import { GoogleGenAI } from "@google/genai";

const MODEL_NAME = 'gemini-2.5-flash-image';

export async function editImage(base64Image: string, prompt: string): Promise<string> {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const mimeTypeMatch = base64Image.match(/^data:(image\/[a-zA-Z]+);base64,/);
  const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/png';
  const data = base64Image.replace(/^data:image\/[a-zA-Z]+;base64,/, "");

  /**
   * 지능형 4:5 자동 구도 알고리즘:
   * 1. 4:5 황금비율 최적화: 모델이 원본의 피사체를 분석하여 가장 예술적인 4:5 portrait 구도로 스스로 '자르고 채우도록' 합니다.
   * 2. 자율적 구성: 불필요한 마진 지시를 제거하고, 전체 이미지가 꽉 차거나 자연스러운 배경 흐름을 갖도록 유도합니다.
   * 3. 인페인팅/아웃페인팅 통합: 잘라내야 할 부분은 과감히 자르고, 채워야 할 배경은 원본의 질감을 살려 자연스럽게 확장합니다.
   */
  const autoCompositionProtocol = `
    INTELLIGENT 4:5 AUTO-CROP & COMPOSITION:
    1. MASTERPIECE RATIO: Your primary goal is to produce a visually stunning 4:5 aspect ratio image.
    2. SMART CROPPING: Analyze the main subject and crop the image to a 4:5 frame that highlights the essence of the work.
    3. SEAMLESS BACKGROUND: If the original content does not fill the 4:5 area, intelligently extend the background (outpaint) using matching textures, colors, and lighting.
    4. NO FORCED MARGINS: Do not add artificial white borders unless they are part of a professional gallery aesthetic. Focus on a full-bleed 4:5 composition.
    5. SUBJECT PRESERVATION: Ensure the main subject is perfectly positioned and not distorted.
  `;

  const finalPrompt = `${autoCompositionProtocol}\n\nUSER MAGIC REQUEST: ${prompt.trim() || "이미지를 가장 아름다운 4:5 구도로 알아서 맞춰줘."}`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          { inlineData: { data: data, mimeType: mimeType } },
          { text: finalPrompt },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4", // 4:5에 가장 근접한 상위 컨테이너 비율 사용
        }
      }
    });

    if (!response.candidates?.[0]?.content?.parts) {
      throw new Error("The magic failed to manifest. Please try again.");
    }

    let resultImageBase64 = '';
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        resultImageBase64 = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!resultImageBase64) throw new Error("Result extraction failed.");

    return resultImageBase64;
  } catch (error: any) {
    console.error("Masterpiece Generation Error:", error);
    throw new Error(error.message || "An error occurred during creation.");
  }
}

import * as ort from "onnxruntime-web";

export type Landmark = { x: number; y: number; z: number };
export type ClassifyResult = {
  label: string;
  confidence: number;
  correct: boolean | null;
};

let session: ort.InferenceSession | null = null;
let labelMap: string[] | null = null;
let loadingPromise: Promise<void> | null = null;

const ARSL_NORM: Record<string, string | null> = {
  aleff: "alif",
  bb: "ba",
  toot: "ta",
  ta: "ta",
  thaa: "tsa",
  jeem: "jim",
  haa: "ha",
  khaa: "kha",
  dal: "dal",
  thal: "dzal",
  ra: "ra",
  zay: "zai",
  seen: "sin",
  sheen: "syin",
  saad: "shad",
  dhad: "dhad",
  taa: "tha",
  dha: "zha",
  ain: "ain",
  ghain: "ghain",
  fa: "fa",
  gaaf: "qaf",
  kaaf: "kaf",
  laam: "lam",
  meem: "mim",
  nun: "nun",
  ha: "ha",
  waw: "waw",
  ya: "ya",
  yaa: "ya",
  al: null,
  la: null,
};

export async function loadHandsignModel(): Promise<void> {
  if (session && labelMap) return;
  if (loadingPromise) return loadingPromise;

  loadingPromise = Promise.all([
    ort.InferenceSession.create("/models/handsign_svm.onnx"),
    fetch("/models/label_map.json").then(async (response) => {
      if (!response.ok) throw new Error("Unable to load hand-sign labels");
      return response.json();
    }),
  ])
    .then(([nextSession, nextLabels]) => {
      if (!Array.isArray(nextLabels) || !nextLabels.every((label) => typeof label === "string")) {
        throw new Error("Invalid hand-sign label map");
      }
      session = nextSession;
      labelMap = nextLabels;
    })
    .catch((error: unknown) => {
      loadingPromise = null;
      throw error;
    });

  return loadingPromise;
}

function normalize(landmarks: Landmark[]): number[][] | null {
  const [wx, wy, wz] = [landmarks[0].x, landmarks[0].y, landmarks[0].z];
  const points = landmarks.map(({ x, y, z }) => [x - wx, y - wy, z - wz]);
  const [mx, my, mz] = points[9];
  const scale = Math.sqrt(mx * mx + my * my + mz * mz);
  if (scale < 1e-6) return null;
  return points.map(([x, y, z]) => [x / scale, y / scale, z / scale]);
}

function computeAngles(points: number[][]): number[] {
  const chains = [
    [0, 1, 2, 3, 4],
    [0, 5, 6, 7, 8],
    [0, 9, 10, 11, 12],
    [0, 13, 14, 15, 16],
    [0, 17, 18, 19, 20],
  ];
  const angles: number[] = [];

  for (const chain of chains) {
    for (let index = 1; index < chain.length - 1; index += 1) {
      const a = points[chain[index - 1]];
      const b = points[chain[index]];
      const c = points[chain[index + 1]];
      const ba = a.map((value, axis) => value - b[axis]);
      const bc = c.map((value, axis) => value - b[axis]);
      const dot = ba.reduce((sum, value, axis) => sum + value * bc[axis], 0);
      const magBa = Math.sqrt(ba.reduce((sum, value) => sum + value * value, 0));
      const magBc = Math.sqrt(bc.reduce((sum, value) => sum + value * value, 0));
      angles.push(Math.max(-1, Math.min(1, dot / (magBa * magBc + 1e-8))));
    }
  }

  return angles;
}

function normalizeTargetLabel(label: string): string {
  const aliases: Record<string, string> = {
    baa: "ba",
    ha1: "ha",
    ha2: "ha",
  };
  const normalized = label.toLowerCase();
  return aliases[normalized] ?? normalized;
}

export async function classifyLandmarks(
  landmarks: Landmark[],
  targetLabel?: string,
): Promise<ClassifyResult | null> {
  if (landmarks.length !== 21) return null;
  await loadHandsignModel();

  const normalized = normalize(landmarks);
  if (!normalized || !session || !labelMap) return null;

  const features = [...normalized.flat(), ...computeAngles(normalized)];
  const tensor = new ort.Tensor("float32", new Float32Array(features), [1, 78]);
  const result = await session.run({ float_input: tensor });
  const outputs = Object.values(result);
  if (outputs.length < 2) throw new Error("Unexpected hand-sign model output");

  const labelIndex = Number(outputs[0].data[0]);
  const probabilities = Array.from(outputs[1].data as Float32Array, Number);
  const rawLabel = labelMap[labelIndex];
  if (!rawLabel || probabilities.length === 0) {
    throw new Error("Invalid hand-sign model output");
  }
  const label = ARSL_NORM[rawLabel] ?? rawLabel;
  const confidence = Math.max(...probabilities);

  return {
    label,
    confidence,
    correct: targetLabel ? label === normalizeTargetLabel(targetLabel) : null,
  };
}

const referenceCache = new Map<string, Uint8Array>();
const USER_THRESHOLD = 0.82;
const FONT_THRESHOLD = 0.5;
const MATCH_THRESHOLD = 0.3;
const MIN_INK = 30;

function toBinary(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  threshold: number,
  checkAlpha: boolean,
): { binary: Uint8Array; inkCount: number } {
  const source = context.getImageData(0, 0, width, height).data;
  const binary = new Uint8Array(width * height);
  let inkCount = 0;

  for (let index = 0; index < width * height; index += 1) {
    if (checkAlpha && source[index * 4 + 3] < 128) continue;
    const luminance =
      (0.299 * source[index * 4] +
        0.587 * source[index * 4 + 1] +
        0.114 * source[index * 4 + 2]) /
      255;
    if (luminance < threshold) {
      binary[index] = 1;
      inkCount += 1;
    }
  }

  return { binary, inkCount };
}

function dilate(binary: Uint8Array, width: number, height: number, radius: number): Uint8Array {
  const output = new Uint8Array(width * height);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (!binary[y * width + x]) continue;
      for (let dy = -radius; dy <= radius; dy += 1) {
        for (let dx = -radius; dx <= radius; dx += 1) {
          const nextY = y + dy;
          const nextX = x + dx;
          if (nextY >= 0 && nextY < height && nextX >= 0 && nextX < width) {
            output[nextY * width + nextX] = 1;
          }
        }
      }
    }
  }

  return output;
}

function diceSimilarity(a: Uint8Array, b: Uint8Array): number {
  let intersection = 0;
  let sizeA = 0;
  let sizeB = 0;

  for (let index = 0; index < a.length; index += 1) {
    if (a[index]) sizeA += 1;
    if (b[index]) sizeB += 1;
    if (a[index] && b[index]) intersection += 1;
  }

  return sizeA + sizeB === 0 ? 0 : (2 * intersection) / (sizeA + sizeB);
}

async function getReference(arabicCharacter: string, width: number, height: number): Promise<Uint8Array> {
  const cacheKey = `${arabicCharacter}_${width}_${height}`;
  const cached = referenceCache.get(cacheKey);
  if (cached) return cached;

  await document.fonts.load("80px 'Noto Naskh Arabic'");
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Unable to create writing reference");

  context.fillStyle = "#fff";
  context.fillRect(0, 0, width, height);
  context.fillStyle = "#000";
  context.font = "bold 80px 'Noto Naskh Arabic', serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(arabicCharacter, width / 2, height / 2);

  const { binary } = toBinary(context, width, height, FONT_THRESHOLD, false);
  referenceCache.set(cacheKey, binary);
  return binary;
}

export async function classifyCanvas(
  canvas: HTMLCanvasElement,
  arabicCharacter: string,
): Promise<{ score: number; correct: boolean }> {
  const devicePixelRatio = window.devicePixelRatio || 1;
  const width = Math.max(1, Math.round(canvas.width / devicePixelRatio / 4));
  const height = Math.max(1, Math.round(canvas.height / devicePixelRatio / 4));
  const userCanvas = document.createElement("canvas");
  userCanvas.width = width;
  userCanvas.height = height;
  const userContext = userCanvas.getContext("2d");
  if (!userContext) throw new Error("Unable to read writing canvas");

  userContext.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, width, height);
  const { binary: rawUser, inkCount } = toBinary(
    userContext,
    width,
    height,
    USER_THRESHOLD,
    true,
  );
  if (inkCount < MIN_INK) return { score: 0, correct: false };

  const reference = await getReference(arabicCharacter, width, height);
  const userBinary = dilate(rawUser, width, height, 3);
  const referenceBinary = dilate(reference, width, height, 2);
  const score = diceSimilarity(userBinary, referenceBinary);

  return { score, correct: score >= MATCH_THRESHOLD };
}

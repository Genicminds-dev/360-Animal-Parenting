import { imageSize } from 'image-size';
import fs from 'fs';

export const validateImageDimensions = async (
  filePath: string,
  width: number,
  height: number
): Promise<boolean> => {
  try {
    const buffer = fs.readFileSync(filePath);
    const dimensions = imageSize(buffer);
    return dimensions.width === width && dimensions.height === height;
  } catch (error) {
    console.error('Image dimension validation error:', error);
    return false;
  }
};

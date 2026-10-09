export type Crop = { src: string; width: number; height: number; blurDataURL: string };

export type Photo = {
  id: string;
  /** Default (4:5) crop — kept flat for convenience. */
  src: string;
  width: number;
  height: number;
  alt: string;
  vehicle: string;
  service: string;
  /** "before" / "after" when the file is half of a pair. */
  stage?: "before" | "after";
  crops: { wide: Crop; tall: Crop; square: Crop };
};

export type PhotoPair = { id: string; vehicle: string; service: string; before: Photo; after: Photo };

export type CropName = keyof Photo["crops"];

export interface TextElement {
  id: string;
  content: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: string;
  // Add other text properties as needed
}

export interface MockupData {
  uploadedImages: string[];
  selectedDevice: string;
  selectedTemplate: number;
  backgroundType: string;
  backgroundColor: string;
  backgroundImage: number;
  selectedPreset: string;
  backgroundNoise: number;
  backgroundBlur: number;
  deviceStyle: string;
  styleEdge: number;
  borderType: string;
  borderRadius: number;
  shadowType: string;
  shadowOpacity: number;
  shadowPosition: string;
  shadowMode: string;
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowBlur: number;
  shadowSpread: number;
  shadowColor: string;
  sceneType: string;
  zoom: number;
  panX: number;
  panY: number;
  layoutMode: string;
  siteUrl: string;
  hideMockup: boolean;
  canvasWidth: number;
  canvasHeight: number;
  selectedResolution: string;
  browserMode: string;
  texts: TextElement[];
}

export interface Mockup {
  id: string;
  name: string;
  data: MockupData;
  created_at: string;
}

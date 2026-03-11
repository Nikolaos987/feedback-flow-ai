export interface Filtering {
  sentiment?: string;
  status?: string;
  severity?: number | string;
  severityRange?: [number, number];
  topic?: string;
  topics?: string[];
}

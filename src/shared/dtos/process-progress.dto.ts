export type ProcessStatus = 'started' | 'inProgress' | 'finished'

export interface ProcessProgressData {
  minValue: number
  maxValue: number
  currentValue: number
  unit: string
  status: ProcessStatus
  processName: string
}

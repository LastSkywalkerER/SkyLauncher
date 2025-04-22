export type ProcessStatus = 'started' | 'inProgress' | 'finished' | 'inited' | 'failed'

export interface ProcessProgressData {
  id: string
  minValue: number
  maxValue: number
  currentValue: number
  unit: string
  status: ProcessStatus
  processName: string
}

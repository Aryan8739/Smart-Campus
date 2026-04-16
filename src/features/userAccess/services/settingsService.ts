import type { AutomationSettings } from '../types'

const STORAGE_KEY = 'campus360_automation_settings'

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export function loadAutomationSettings(defaultValue: AutomationSettings): AutomationSettings {
  if (typeof window === 'undefined') {
    return defaultValue
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return defaultValue
    }

    const parsed = JSON.parse(raw) as Partial<AutomationSettings>
    return {
      ...defaultValue,
      ...parsed,
    }
  } catch {
    return defaultValue
  }
}

export async function saveAutomationSettings(
  settings: AutomationSettings
): Promise<AutomationSettings> {
  await delay(600)

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }

  return settings
}

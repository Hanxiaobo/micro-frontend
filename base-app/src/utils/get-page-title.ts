import defaultSettings from '../settings'

const title = defaultSettings.title || '1234'

export default function getPageTitle(pageTitle: string): string {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}

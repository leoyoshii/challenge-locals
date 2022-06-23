export interface IRestCountryResponse {
  name?: {
    common?: string
    official?: string
    nativeName?: {
      [key: string]: {
        official: string
        common: string
      }
    }
  }
  translations: {
    [key: string]: {
      official?: string
      common: string
    }
  }
  flags: {
    png: string
    svg?: string
  }
}

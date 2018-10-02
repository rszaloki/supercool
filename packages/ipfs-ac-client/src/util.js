export const redirect = (url, data = {}) => {
  history.pushState(data, '', url)
}

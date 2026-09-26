const changeHttpToHttps = (url: string): string => {
  if (typeof url !== 'string') return '';
  if (url.startsWith('https://')) return url;
  if (url.startsWith('http://')) return url.replace('http://', 'https://');
  return '';
};

export { changeHttpToHttps };

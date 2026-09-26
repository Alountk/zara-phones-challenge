const changeHttpToHttps = (url: string): string => {
  if (typeof url === 'string' && url.startsWith('http://')) {
    return url.replace('http://', 'https://');
  }
  if (typeof url === 'string' && url.startsWith('https://')) {
    return url;
  }
  return '';
};

export { changeHttpToHttps };

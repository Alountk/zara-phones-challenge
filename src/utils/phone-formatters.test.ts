import {
  camelCaseToLabel,
  changeHttpToHttps,
  dedupeById,
  formatPrice,
  normalizePhoneSummaries,
  normalizePrice,
} from './phone-formatters';

describe('when change http to https', () => {
  it('http is empty return empty string', () => {
    const result = changeHttpToHttps('');
    expect(result).toBe('');
  });
  it('http is null return empty string', () => {
    const result = changeHttpToHttps(null as any);
    expect(result).toBe('');
  });
  it('http is undefined return empty string', () => {
    const result = changeHttpToHttps(undefined as any);
    expect(result).toBe('');
  });
  it('http is not a string return empty string', () => {
    const result = changeHttpToHttps(123 as any);
    expect(result).toBe('');
  });
  it('if the url has https return the same url', () => {
    const result = changeHttpToHttps('https://example.com');
    expect(result).toBe('https://example.com');
  });
  it('http is a valid url return https url', () => {
    const result = changeHttpToHttps('http://example.com');
    expect(result).toBe('https://example.com');
  });
});

describe('normalize the price', () => {
  it('if the price is a string return null', () => {
    const result = normalizePrice('123' as any);
    expect(result).toBeNull();
  });
  it('if the price is a null return null', () => {
    const result = normalizePrice(null as any);
    expect(result).toBeNull();
  });
  it('if the price is a undefined return null', () => {
    const result = normalizePrice(undefined as any);
    expect(result).toBeNull();
  });
  it('if the price has decimal round correctly', () => {
    const roundDown = normalizePrice(123.45);
    const roundUp = normalizePrice(123.55);
    expect(roundDown).toBe(123);
    expect(roundUp).toBe(124);
  });
});

describe('dedupeById', () => {
  it('if the array is empty return an empty array', () => {
    const result = dedupeById([]);
    expect(result).toEqual([]);
  });
  it('if there are no duplicates return the same array', () => {
    const array = [
      { id: '1', name: 'Phone 1' },
      { id: '2', name: 'Phone 2' },
    ];
    const result = dedupeById(array);
    expect(result).toEqual(array);
  });
  it('removes duplicates based on id', () => {
    const array = [
      { id: '1', name: 'Phone 1' },
      { id: '1', name: 'Phone 1 Duplicate' },
      { id: '2', name: 'Phone 2' },
    ];
    const result = dedupeById(array);
    expect(result).toEqual([
      { id: '1', name: 'Phone 1' },
      { id: '2', name: 'Phone 2' },
    ]);
  });
  it('removes duplicates not consecutively based on id', () => {
    const array = [
      { id: '1', name: 'Phone 1' },
      { id: '2', name: 'Phone 2' },
      { id: '1', name: 'Phone 1 Duplicate' },
    ];
    const result = dedupeById(array);
    expect(result).toEqual([
      { id: '1', name: 'Phone 1' },
      { id: '2', name: 'Phone 2' },
    ]);
  });
  it('if the array has a multiple duplicates return only one of each', () => {
    const array = [
      { id: '1', name: 'Phone 1' },
      { id: '2', name: 'Phone 2' },
      { id: '1', name: 'Phone 1 Duplicate' },
      { id: '3', name: 'Phone 3' },
      { id: '2', name: 'Phone 2 Duplicate' },
    ];
    const result = dedupeById(array);
    expect(result).toEqual([
      { id: '1', name: 'Phone 1' },
      { id: '2', name: 'Phone 2' },
      { id: '3', name: 'Phone 3' },
    ]);
  });
  it('removes duplicates not consecutively based on id with API data', () => {
    const array = [
      { id: 'XMI-RN13P5G', name: 'Redmi Note 13 Pro 5G' },
      { id: 'XMI-RN13P5G', name: 'Redmi Note 13 Pro 5G Duplicate' },
      { id: 'SMG-S24U', name: 'Galaxy S24 Ultra' },
      { id: 'SMG-A25', name: 'Galaxy A25 5G' },
      { id: 'GPX-8A', name: 'Pixel 8a' },
      { id: 'SMG-A25', name: 'Galaxy A25 5G Duplicate' },
    ];
    const result = dedupeById(array);
    expect(result).toEqual([
      { id: 'XMI-RN13P5G', name: 'Redmi Note 13 Pro 5G' },
      { id: 'SMG-S24U', name: 'Galaxy S24 Ultra' },
      { id: 'SMG-A25', name: 'Galaxy A25 5G' },
      { id: 'GPX-8A', name: 'Pixel 8a' },
    ]);
  });
});

describe('formatPrice', () => {
  it('when the price is null return not available', () => {
    const result = formatPrice(null);
    expect(result).toBe('Price unavailable');
  });
  it('when the prices are valid return with EUR currency', () => {
    const result = formatPrice(699);
    expect(result).toBe('699 EUR');
  });
});

describe('normalize phone summaries', () => {
  const phonesListMock = [
    {
      id: 'SMG-S24U',
      brand: 'Samsung',
      name: 'Galaxy S24 Ultra',
      basePrice: 1329.78,
      imageUrl:
        'http://prueba-tecnica-api-tienda-moviles.onrender.com/images/SMG-S24U-titanium-violet.webp',
    },
    {
      id: 'SMG-A25',
      brand: 'Samsung',
      name: 'Galaxy A25 5G',
      basePrice: 239.25,
      imageUrl: 'http://prueba-tecnica-api-tienda-moviles.onrender.com/images/SMG-A25-negro.webp',
    },
    {
      id: 'GPX-8A',
      brand: 'Google',
      name: 'Pixel 8a',
      basePrice: 459.45,
      imageUrl:
        'http://prueba-tecnica-api-tienda-moviles.onrender.com/images/GPX-8A-obsidiana.webp',
    },
    {
      id: 'SMG-S24U',
      brand: 'Samsung',
      name: 'Galaxy S24 Ultra',
      basePrice: 1329.78,
      imageUrl:
        'http://prueba-tecnica-api-tienda-moviles.onrender.com/images/SMG-S24U-titanium-violet.webp',
    },
  ];

  it('when the Phones list has a duplicate return dedupe phones', () => {
    const result = normalizePhoneSummaries(phonesListMock);

    expect(result).toHaveLength(3);
  });
  it('return the phone basePrice without decimal in every phones with decimal', () => {
    const result = normalizePhoneSummaries(phonesListMock);

    const checkNumberFormat = [1330, 239, 459];
    result.forEach((phone, index) => {
      expect(phone.basePrice).toEqual(checkNumberFormat[index]);
    });
  });
  it('change http to https en every phone url', () => {
    const result = normalizePhoneSummaries(phonesListMock);

    result.forEach((phone) => {
      expect(phone.imageUrl).toContain('https://');
    });
  });
});

describe('camelCaseToLabel', () => {
  it('splits camelCase keys into capitalized words', () => {
    expect(camelCaseToLabel('mainCamera')).toBe('Main Camera');
    expect(camelCaseToLabel('screenRefreshRate')).toBe('Screen Refresh Rate');
  });

  it('capitalizes single-word keys', () => {
    expect(camelCaseToLabel('os')).toBe('Os');
  });

  it('keeps consecutive capitals together', () => {
    expect(camelCaseToLabel('NFCEnabled')).toBe('NFC Enabled');
  });
});

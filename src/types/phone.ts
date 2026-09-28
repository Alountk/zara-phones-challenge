export interface PhoneSummary {
  id: string;
  brand: string; // Inconsistency in the use of capital letters (‘Xiaomi’ versus ‘XIAOMI’ versus ‘SONY’): this should be standardised in the styles.
  name: string;
  basePrice: number; // The prices contain decimals; we need to convert these to whole numbers so that they are displayed as shown in the design (e.g. 699.99 → 699 EUR)
  imageUrl: string; // The server returns an image URL in http (not secure), so we need to implement a helper to convert it to a secure https URL.
}

export interface ColorOption {
  name: string;
  hexCode: string;
  imageUrl: string;
}

interface StorageOption {
  capacity: string;
  price: number;
}

export interface PhoneDetail extends Omit<PhoneSummary, 'imageUrl'> {
  description: string;
  rating: number;
  specs: Record<string, string>; // This should be a flexible dictionary, as the fields differ from one phone to another.
  colorOptions: ColorOption[];
  storageOptions: StorageOption[];
  similarProducts: PhoneSummary[];
}

export interface NormalizedPhoneSummary extends Omit<PhoneSummary, 'basePrice'> {
  basePrice: number | null; // The prices contain decimals; we need to convert these to whole numbers so that they are displayed as shown in the design (e.g. 699.99 → 699 EUR)
}

export interface NormalizedStorageOption extends Omit<StorageOption, 'price'> {
  price: number | null;
}
export interface NormalizedPhoneDetail extends Omit<
  PhoneDetail,
  'basePrice' | 'storageOptions' | 'similarProducts'
> {
  basePrice: number | null; // The prices contain decimals; we need to convert these to whole numbers so that they are displayed as shown in the design (e.g. 699.99 → 699 EUR)
  storageOptions: NormalizedStorageOption[];
  similarProducts: NormalizedPhoneSummary[];
}

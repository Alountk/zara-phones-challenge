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

export interface StorageOption {
  capacity: string;
  price: number;
}

export interface PhoneDetail extends PhoneSummary {
  description: string;
  rating: number;
  specs: Record<string, string>; // This should be a flexible dictionary, as the fields differ from one phone to another.
  colorOptions: ColorOption[];
  storageOptions: StorageOption[];
  similarProducts: PhoneSummary[];
}

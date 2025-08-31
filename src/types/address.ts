export interface Address {
  city: string;
  firstName: string;
  houseNumber: string;
  id: string;
  lastName: string;
  postcode: string;
  street: string;
}

export interface AddressForm {
  postCode: Address["postcode"];
  houseNumber: Address["houseNumber"];
  selectedAddress?: string;
}

export interface PersonForm {
  firstName: Address["firstName"];
  lastName: Address["lastName"];
}

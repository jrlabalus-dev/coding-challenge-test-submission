import { Address } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

// Define a type for the slice state
interface CounterState {
  addresses: Address[];
}

// Define the initial state using that type
const initialState: CounterState = {
  addresses: [],
};

export const addressBookSlice = createSlice({
  name: "address",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addAddress: (state, action: PayloadAction<Address>) => {
      /** TODO: Prevent duplicate addresses */
      const addressExists = state.addresses.some(
        (address) =>
          address.city === action.payload.city &&
          address.houseNumber === action.payload.houseNumber &&
          address.postcode === action.payload.postcode &&
          address.street === action.payload.street
      );

      if (!addressExists) state.addresses.push(action.payload);
    },
    removeAddress: (state, action: PayloadAction<string>) => {
      /** TODO: Write a state update which removes an address from the addresses array. */
      const idxToDel = state.addresses.findIndex(
        ({ id }) => id === action.payload
      );
      state.addresses.splice(idxToDel, 1);
    },
    updateAddresses: (state, action: PayloadAction<Address[]>) => {
      state.addresses = action.payload;
    },
  },
});

export const { addAddress, removeAddress, updateAddresses } =
  addressBookSlice.actions;

// // Other code such as selectors can use the imported `RootState` type
export const selectAddress = (state: RootState) => state.addressBook.addresses;

export default addressBookSlice.reducer;

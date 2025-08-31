import React from "react";

import Address from "@/components/Address/Address";
import AddressBook from "@/components/AddressBook/AddressBook";
import Button from "@/components/Button/Button";
import InputText from "@/components/InputText/InputText";
import Radio from "@/components/Radio/Radio";
import Section from "@/components/Section/Section";
import useAddressBook from "@/hooks/useAddressBook";

import styles from "./App.module.css";
import { Address as AddressType } from "./types";
import useForm from "@/hooks/useForm";
import Form, { ValidatorFn } from "@/components/Form/Form";

interface AddressForm {
  postCode: string;
  houseNumber: string;
  selectedAddress?: number;
}

interface PersonForm {
  firstName: string;
  lastName: string;
}

async function getAddresses (postCode: string, streetnumber: string) {
  if (streetnumber && postCode) {
    const params = new URLSearchParams({ postcode: postCode, streetnumber })
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/getAddresses?${params.toString()}`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.errormessage || "Failed to get addresses");
    }
    
    const data = await response.json();

    return data;
  }
}

const required: ValidatorFn<string> = (value) => !value.trim() ? "Field is required.": undefined;

const addressFormFields = [
  {
    name: "postCode",
    validators: [
      required,
    ],
    extraProps: {
      placeholder: "Post Code"
    }
  },
  {
    name: "houseNumber",
    validators: [
      required,
    ],
    extraProps: {
      placeholder: "House Number"
    }
  },
]

const personFormFields = [
  {
    name: "firstName",
    validators: [
      required,
    ],
    extraProps: {
      placeholder: "First name"
    }
  },
  {
    name: "lastName",
    validators: [
      required,
    ],
    extraProps: {
      placeholder: "Last name"
    }
  },
]

const addressValidators = {
  postCode: [required],
  houseNumber: [required],
}

const personValidators = {
  firstName: [required],
  lastName: [required],
}


function App() {
  /**
   * Form fields states
   * TODO: Write a custom hook to set form fields in a more generic way:
   * - Hook must expose an onChange handler to be used by all <InputText /> and <Radio /> components
   * - Hook must expose all text form field values, like so: { postCode: '', houseNumber: '', ...etc }
   * - Remove all individual React.useState
   * - Remove all individual onChange handlers, like handlePostCodeChange for example
   */

  /**
   * Results states
   */

  const [error, setError] = React.useState<undefined | string>(undefined);
  const [addresses, setAddresses] = React.useState<AddressType[]>([]);
  /**
   * Redux actions
   */
  const { addAddress } = useAddressBook();

  /** TODO: Fetch addresses based on houseNumber and postCode using the local BE api
   * - Example URL of API: ${process.env.NEXT_PUBLIC_URL}/api/getAddresses?postcode=1345&streetnumber=350
   * - Ensure you provide a BASE URL for api endpoint for grading purposes!
   * - Handle errors if they occur
   * - Handle successful response by updating the `addresses` in the state using `setAddresses`
   * - Make sure to add the houseNumber to each found address in the response using `transformAddress()` function
   * - Ensure to clear previous search results on each click
   * - Bonus: Add a loading state in the UI while fetching addresses
   */
  const handleAddressSubmit = async (form) => {
    try {
      const addressesData = await getAddresses(form.postCode, form.houseNumber);
      setAddresses(addressesData.details);
    } catch(e) {
      setError(e.errormessage);

      console.log('test', e.errormessage)
      setAddresses([]);
    }
  };

  /** TODO: Add basic validation to ensure first name and last name fields aren't empty
   * Use the following error message setError("First name and last name fields mandatory!")
   */

  const handlePersonSubmit = ({ firstName, lastName}) => {

    if (!selectedAddress || !addresses?.length) {
      setError(
        "No address selected, try to select an address or find one if you haven't"
      );
      return;
    }

    const foundAddress = addresses[selectedAddress];

    if (!foundAddress) {
      setError("Selected address not found");
      return;
    }

    addAddress({ ...foundAddress, firstName, lastName });
    
  };


  const addressForm = useForm<AddressForm>({
    postCode: "",
    houseNumber: "",
    selectedAddress: undefined,
  }, addressValidators, handleAddressSubmit);

  const personForm = useForm<PersonForm>({
    firstName: "",
    lastName: "",
  }, personValidators, handlePersonSubmit);

  const {
    selectedAddress
  } = addressForm.values;

console.log('addressForm.errors', addressForm.errors)

  return (
    <main>
      <Section>
        <h1 className={styles.title}>
          Create your own address book!
          <br />
          <small>
            Enter an address by postcode add personal info and done! 👏
          </small>
        </h1>
        <Form 
          formEntries={addressFormFields} 
          onFormSubmit={addressForm.handleSubmit} 
          values={addressForm.values} 
          onChange={addressForm.handleChange} 
          submitText="Find" 
          label="🏠 Find an address" 
          errors={addressForm.errors}
        />
        {addresses?.length > 0 &&
          addresses.map((address, i) => {
            return (
              <Radio
                name="selectedAddress"
                id={i.toString()}
                key={i.toString()}
                onChange={addressForm.handleChange}
              >
                <Address {...address} />
              </Radio>
            );
          })}
        {/* TODO: Create generic <Form /> component to display form rows, legend and a submit button  */}
        {selectedAddress && addresses && (
          // <form onSubmit={handlePersonSubmit}>
          //   <fieldset>
          //     <legend>✏️ Add personal info to address</legend>
          //     <div className={styles.formRow}>
          //       <InputText
          //         name="firstName"
          //         placeholder="First name"
          //         onChange={handleChange}
          //         value={firstName}
          //       />
          //     </div>
          //     <div className={styles.formRow}>
          //       <InputText
          //         name="lastName"
          //         placeholder="Last name"
          //         onChange={handleChange}
          //         value={lastName}
          //       />
          //     </div>
          //     <Button type="submit">Add to addressbook</Button>
          //   </fieldset>
          // </form>

          <Form 
            formEntries={personFormFields} 
            onFormSubmit={personForm.handleSubmit} 
            values={addresses[selectedAddress]} 
            onChange={personForm.handleChange} 
            submitText="Find" label="✏️ Add personal info to address"
          />
        )}

        {/* TODO: Create an <ErrorMessage /> component for displaying an error message */}
        {error && <div className="error">{error}</div>}

        {/* TODO: Add a button to clear all form fields. 
        Button must look different from the default primary button, see design. 
        Button text name must be "Clear all fields"
        On Click, it must clear all form fields, remove all search results and clear all prior
        error messages
        */}
      </Section>

      <Section variant="dark">
        <AddressBook />
      </Section>
    </main>
  );
}

export default App;

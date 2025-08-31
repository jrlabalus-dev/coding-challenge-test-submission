import { screen,} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App, { getAddresses } from './App';
import { render } from './utils/testUtils';

describe('<App>',() => {
  beforeAll(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ details: [] }),
      })
    ) as jest.Mock;
  });

  it('renders the Card Title', () => {
    render(<App />);

    expect(
      screen.getByText('Create your own address book!')
    ).toBeInTheDocument();
  })

  it('renders the Card subtitle', () => {
    render(<App />);

    expect(
      screen.getByText('Enter an address by postcode add personal info and done! 👏')
    ).toBeInTheDocument();
  })

  it('renders postCode and houseNumber inputs',() => {
    render(<App />);

    expect(
      screen.getByRole('textbox', { name: "postCode" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: "houseNumber" })
    ).toBeInTheDocument();
  });

  describe('when "Find" button is clicked', () => {
    describe('when the inputs are empty', ()=>{
      it('show validation warnings', async () => {
        render(<App />);

        await userEvent.click(screen.getByRole('button', { name: "Find" }))

        expect(
          await screen.findAllByText('Field is required.')
        ).toHaveLength(2);
      })
    })

  });
  
})
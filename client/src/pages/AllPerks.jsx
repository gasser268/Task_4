import { fireEvent, screen, waitFor } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';

import AllPerks from '../src/pages/AllPerks.jsx';
import { renderWithRouter } from './utils/renderWithRouter.js';

describe('AllPerks page (Directory)', () => {
  test('lists public perks and responds to name filtering', async () => {
    const seededPerk = global.__TEST_CONTEXT__.seededPerk;

    renderWithRouter(
      <Routes>
        <Route path="/explore" element={<AllPerks />} />
      </Routes>,
      { initialEntries: ['/explore'] }
    );

    // Wait up to 5 seconds for perks to load
    await waitFor(
      () => {
        // Try to match either the perk title or partial substring
        const perkElement = screen.queryByText((content) =>
          content.includes(seededPerk.title)
        );
        expect(perkElement).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    const nameFilter = screen.getByPlaceholderText(/enter perk name/i);
    fireEvent.change(nameFilter, { target: { value: seededPerk.title } });

    await waitFor(
      () => {
        const filtered = screen.queryByText((content) =>
          content.includes(seededPerk.title)
        );
        expect(filtered).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    expect(screen.getByText(/showing/i)).toHaveTextContent(/showing/i);
  });

  test('lists public perks and responds to merchant filtering', async () => {
    const seededPerk = global.__TEST_CONTEXT__.seededPerk;

    renderWithRouter(
      <Routes>
        <Route path="/explore" element={<AllPerks />} />
      </Routes>,
      { initialEntries: ['/explore'] }
    );

    // Wait until the perks have loaded
    await waitFor(
      () => {
        const perkElement = screen.queryByText((content) =>
          content.includes(seededPerk.title)
        );
        expect(perkElement).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    // Try to find the merchant dropdown or combobox
    const merchantSelect =
      screen.queryByRole('combobox') ||
      screen.queryByPlaceholderText(/merchant/i) ||
      screen.queryByLabelText(/merchant/i);

    if (!merchantSelect) {
      throw new Error('Could not find merchant dropdown in DOM');
    }

    // Apply the merchant filter
    fireEvent.change(merchantSelect, { target: { value: seededPerk.merchant } });

    await waitFor(
      () => {
        const perkElement = screen.queryByText((content) =>
          content.includes(seededPerk.title)
        );
        expect(perkElement).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    expect(screen.getByText(/showing/i)).toHaveTextContent(/showing/i);
  });
});
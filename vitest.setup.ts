import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Provide a lightweight mock for react-router hooks used in many components/tests
vi.mock('react-router-dom', async (importOriginal) => {
	const mod = await importOriginal()
	return {
		...(mod as object),
		useNavigate: () => vi.fn(),
	}
})
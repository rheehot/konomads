import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

describe('Select Component (UI-038 ~ UI-043)', () => {
  describe('UI-038: Basic Rendering', () => {
    it('should render select component', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      )

      expect(screen.getByRole('combobox')).toBeInTheDocument()
      expect(screen.getByText('Select an option')).toBeInTheDocument()
    })

    it('should render select trigger', () => {
      render(
        <Select>
          <SelectTrigger data-testid="select-trigger">
            <SelectValue placeholder="Choose" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Item 1</SelectItem>
          </SelectContent>
        </Select>
      )

      expect(screen.getByTestId('select-trigger')).toBeInTheDocument()
    })

    it('should render select content with options', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">Option A</SelectItem>
            <SelectItem value="b">Option B</SelectItem>
            <SelectItem value="c">Option C</SelectItem>
          </SelectContent>
        </Select>
      )

      // Content is rendered in a portal and not visible by default
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })
  })

  describe('UI-039: Option Selection', () => {
    it('should open dropdown when clicking trigger', async () => {
      const user = userEvent.setup()
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      )

      await user.click(screen.getByRole('combobox'))

      // After opening, options should be visible
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument()
        expect(screen.getByText('Option 2')).toBeInTheDocument()
      })
    })

    it('should select option when clicking item', async () => {
      const user = userEvent.setup()
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
          </SelectContent>
        </Select>
      )

      await user.click(screen.getByRole('combobox'))

      await waitFor(() => {
        const option = screen.getByText('Apple')
        expect(option).toBeInTheDocument()
      })

      const appleOption = screen.getByText('Apple')
      await user.click(appleOption)

      // Value should be updated
      await waitFor(() => {
        expect(screen.getByText('Apple')).toBeInTheDocument()
      })
    })

    it('should update selected value display', async () => {
      const user = userEvent.setup()
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Pick a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="orange">Orange</SelectItem>
          </SelectContent>
        </Select>
      )

      const trigger = screen.getByRole('combobox')
      await user.click(trigger)

      await waitFor(() => {
        const orangeOption = screen.getByText('Orange')
        expect(orangeOption).toBeInTheDocument()
      })

      const orangeOption = screen.getByText('Orange')
      await user.click(orangeOption)

      await waitFor(() => {
        expect(screen.getByText('Orange')).toBeInTheDocument()
      })
    })
  })

  describe('UI-040: Placeholder', () => {
    it('should display placeholder text when no value is selected', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Choose an item" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Item 1</SelectItem>
          </SelectContent>
        </Select>
      )

      expect(screen.getByText('Choose an item')).toBeInTheDocument()
    })

    it('should hide placeholder after selection', async () => {
      const user = userEvent.setup()
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select something" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="selected">Selected Item</SelectItem>
          </SelectContent>
        </Select>
      )

      expect(screen.getByText('Select something')).toBeInTheDocument()

      await user.click(screen.getByRole('combobox'))

      await waitFor(() => {
        const item = screen.getByText('Selected Item')
        expect(item).toBeInTheDocument()
      })

      const item = screen.getByText('Selected Item')
      await user.click(item)

      await waitFor(() => {
        expect(screen.queryByText('Select something')).not.toBeInTheDocument()
      })
    })
  })

  describe('UI-041: defaultValue', () => {
    it('should select default value', () => {
      render(
        <Select defaultValue="option2">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
            <SelectItem value="option3">Option 3</SelectItem>
          </SelectContent>
        </Select>
      )

      // Default value should be displayed
      expect(screen.getByText('Option 2')).toBeInTheDocument()
    })

    it('should not show placeholder when defaultValue is set', () => {
      render(
        <Select defaultValue="item1">
          <SelectTrigger>
            <SelectValue placeholder="Placeholder" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="item1">Item 1</Item>
          </SelectContent>
        </Select>
      )

      expect(screen.queryByText('Placeholder')).not.toBeInTheDocument()
      expect(screen.getByText('Item 1')).toBeInTheDocument()
    })
  })

  describe('UI-042: Disabled State', () => {
    it('should be disabled when disabled prop is true', () => {
      render(
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Disabled Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Item 1</SelectItem>
          </SelectContent>
        </Select>
      )

      const trigger = screen.getByRole('combobox')
      expect(trigger).toBeDisabled()
    })

    it('should not open dropdown when disabled', async () => {
      const user = userEvent.setup()
      render(
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Disabled" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Item 1</SelectItem>
          </SelectContent>
        </Select>
      )

      const trigger = screen.getByRole('combobox')
      await user.click(trigger)

      // Content should not appear
      expect(screen.queryByText('Item 1')).not.toBeInTheDocument()
    })

    it('should apply disabled styles', () => {
      render(
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Disabled Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Item 1</SelectItem>
          </SelectContent>
        </Select>
      )

      const trigger = screen.getByRole('combobox')
      expect(trigger).toHaveClass('disabled:opacity-50')
    })

    it('should disable individual items', async () => {
      const user = userEvent.setup()
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="enabled">Enabled Item</SelectItem>
            <SelectItem value="disabled" disabled>
              Disabled Item
            </SelectItem>
          </SelectContent>
        </Select>
      )

      await user.click(screen.getByRole('combobox'))

      await waitFor(() => {
        const disabledItem = screen.getByText('Disabled Item')
        expect(disabledItem).toHaveAttribute('data-disabled')
      })
    })
  })

  describe('UI-043: onValueChange', () => {
    it('should call onValueChange when selecting option', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()

      render(
        <Select onValueChange={handleChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">Option A</SelectItem>
            <SelectItem value="b">Option B</SelectItem>
          </SelectContent>
        </Select>
      )

      await user.click(screen.getByRole('combobox'))

      await waitFor(() => {
        const optionA = screen.getByText('Option A')
        expect(optionA).toBeInTheDocument()
      })

      const optionA = screen.getByText('Option A')
      await user.click(optionA)

      expect(handleChange).toHaveBeenCalledWith('a')
    })

    it('should call onValueChange with correct value', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()

      render(
        <Select onValueChange={handleChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="first">First</SelectItem>
            <SelectItem value="second">Second</SelectItem>
            <SelectItem value="third">Third</SelectItem>
          </SelectContent>
        </Select>
      )

      await user.click(screen.getByRole('combobox'))

      await waitFor(() => {
        const secondOption = screen.getByText('Second')
        expect(secondOption).toBeInTheDocument()
      })

      const secondOption = screen.getByText('Second')
      await user.click(secondOption)

      expect(handleChange).toHaveBeenCalledWith('second')
      expect(handleChange).toHaveBeenCalledTimes(1)
    })

    it('should not call onValueChange when selecting disabled option', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()

      render(
        <Select onValueChange={handleChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="enabled">Enabled</SelectItem>
            <SelectItem value="disabled" disabled>
              Disabled
            </SelectItem>
          </SelectContent>
        </Select>
      )

      await user.click(screen.getByRole('combobox'))

      await waitFor(() => {
        const disabledOption = screen.getByText('Disabled')
        expect(disabledOption).toBeInTheDocument()
      })

      const disabledOption = screen.getByText('Disabled')
      await user.click(disabledOption)

      expect(handleChange).not.toHaveBeenCalled()
    })
  })

  describe('Additional Select Features', () => {
    it('should apply custom className to SelectTrigger', () => {
      render(
        <Select>
          <SelectTrigger className="custom-trigger">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Item 1</SelectItem>
          </SelectContent>
        </Select>
      )

      expect(screen.getByRole('combobox')).toHaveClass('custom-trigger')
    })

    it('should apply custom className to SelectItem', async () => {
      const user = userEvent.setup()
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1" className="custom-item">
              Custom Item
            </SelectItem>
          </SelectContent>
        </Select>
      )

      await user.click(screen.getByRole('combobox'))

      await waitFor(() => {
        const customItem = screen.getByText('Custom Item')
        expect(customItem).toHaveClass('custom-item')
      })
    })
  })
})

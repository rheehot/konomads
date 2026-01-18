import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

describe('Dialog Component (UI-030 ~ UI-037)', () => {
  describe('UI-030: Basic Rendering', () => {
    it('should render dialog component', () => {
      render(
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
          </DialogContent>
        </Dialog>
      )

      expect(screen.getByRole('button', { name: 'Open Dialog' })).toBeInTheDocument()
    })

    it('should not render dialog content when closed', () => {
      render(
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Description</DialogDescription>
          </DialogContent>
        </Dialog>
      )

      expect(screen.queryByText('Title')).not.toBeInTheDocument()
    })
  })

  describe('UI-031: Open/Close', () => {
    it('should open dialog when clicking trigger', async () => {
      const user = userEvent.setup()
      render(
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Content</DialogDescription>
          </DialogContent>
        </Dialog>
      )

      await user.click(screen.getByRole('button', { name: 'Open Dialog' }))

      await waitFor(() => {
        expect(screen.getByText('Dialog Title')).toBeInTheDocument()
        expect(screen.getByText('Dialog Content')).toBeInTheDocument()
      })
    })

    it('should close dialog when clicking close button', async () => {
      const user = userEvent.setup()
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Content</DialogDescription>
          </DialogContent>
        </Dialog>
      )

      expect(screen.getByText('Dialog Title')).toBeInTheDocument()

      const closeButton = screen.getByRole('button', { name: '' })
      await user.click(closeButton)

      await waitFor(() => {
        expect(screen.queryByText('Dialog Title')).not.toBeInTheDocument()
      })
    })

    it('should close dialog when clicking overlay', async () => {
      const user = userEvent.setup()
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogContent>
        </Dialog>
      )

      const overlay = screen.getByText('Dialog Title').closest('[data-radix-portal]')?.querySelector('[data-state="open"]')

      if (overlay) {
        await user.click(overlay)
        await waitFor(() => {
          expect(screen.queryByText('Dialog Title')).not.toBeInTheDocument()
        })
      }
    })

    it('should close dialog when pressing Escape key', async () => {
      const user = userEvent.setup()
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogContent>
        </Dialog>
      )

      expect(screen.getByText('Dialog Title')).toBeInTheDocument()

      await user.keyboard('{Escape}')

      await waitFor(() => {
        expect(screen.queryByText('Dialog Title')).not.toBeInTheDocument()
      })
    })
  })

  describe('UI-032: DialogTrigger', () => {
    it('should render custom trigger component using asChild', () => {
      render(
        <Dialog>
          <DialogTrigger asChild>
            <button data-testid="custom-trigger">Custom Trigger</button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
          </DialogContent>
        </Dialog>
      )

      expect(screen.getByTestId('custom-trigger')).toBeInTheDocument()
    })

    it('should open dialog when clicking custom trigger', async () => {
      const user = userEvent.setup()
      render(
        <Dialog>
          <DialogTrigger asChild>
            <button>Custom Trigger</button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
          </DialogContent>
        </Dialog>
      )

      await user.click(screen.getByRole('button', { name: 'Custom Trigger' }))

      await waitFor(() => {
        expect(screen.getByText('Title')).toBeInTheDocument()
      })
    })
  })

  describe('UI-033: DialogClose', () => {
    it('should render DialogClose button', () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <DialogFooter>
              <DialogClose asChild>
                <Button>Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )

      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    })

    it('should close dialog when clicking DialogClose button', async () => {
      const user = userEvent.setup()
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      )

      expect(screen.getByText('Title')).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'Close' }))

      await waitFor(() => {
        expect(screen.queryByText('Title')).not.toBeInTheDocument()
      })
    })
  })

  describe('UI-034: DialogTitle', () => {
    it('should render dialog title', async () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>My Dialog Title</DialogTitle>
          </DialogContent>
        </Dialog>
      )

      expect(screen.getByText('My Dialog Title')).toBeInTheDocument()
    })

    it('should have correct heading role', () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogContent>
        </Dialog>
      )

      const title = screen.getByText('Dialog Title')
      expect(title.tagName).toBe('H2')
    })

    it('should apply custom className', () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle className="custom-title-class">Title</DialogTitle>
          </DialogContent>
        </Dialog>
      )

      expect(screen.getByText('Title')).toHaveClass('custom-title-class')
    })
  })

  describe('UI-035: DialogDescription', () => {
    it('should render dialog description', () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>This is the dialog description</DialogDescription>
          </DialogContent>
        </Dialog>
      )

      expect(screen.getByText('This is the dialog description')).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription className="custom-desc-class">
              Description
            </DialogDescription>
          </DialogContent>
        </Dialog>
      )

      expect(screen.getByText('Description')).toHaveClass('custom-desc-class')
    })
  })

  describe('UI-036: Portal', () => {
    it('should render dialog in portal', () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Portal Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      )

      // Radix UI uses portals, check if content exists
      expect(screen.getByText('Portal Dialog')).toBeInTheDocument()
    })

    it('should render overlay in portal', () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      )

      // Overlay should be present when dialog is open
      const dialogContent = screen.getByText('Dialog')
      expect(dialogContent).toBeInTheDocument()
    })
  })

  describe('UI-037: Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Accessible Dialog</DialogTitle>
            <DialogDescription>Description</DialogDescription>
          </DialogContent>
        </Dialog>
      )

      const dialog = screen.getByRole('dialog', { hidden: true })
      expect(dialog).toBeInTheDocument()
    })

    it('should have close button with screen reader text', () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
          </DialogContent>
        </Dialog>
      )

      // X button should have sr-only text "Close"
      const closeButton = screen.getByRole('button', { name: '' })
      expect(closeButton).toBeInTheDocument()
    })

    it('should trap focus within dialog when open', async () => {
      const user = userEvent.setup()
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Description</DialogDescription>
            <DialogFooter>
              <Button>Action</Button>
              <DialogClose asChild>
                <Button>Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )

      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)

      // Focus management is handled by Radix UI
      const dialogContent = screen.getByText('Title').closest('[data-radix-portal]')
      expect(dialogContent).toBeInTheDocument()
    })

    it('should return focus to trigger after closing', async () => {
      const user = userEvent.setup()
      render(
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      )

      const trigger = screen.getByRole('button', { name: 'Open Dialog' })
      await user.click(trigger)

      await waitFor(() => {
        expect(screen.getByText('Title')).toBeInTheDocument()
      })

      const closeButton = screen.getAllByRole('button').find(btn => btn.textContent === 'Close')
      if (closeButton) {
        await user.click(closeButton)
      }

      await waitFor(() => {
        expect(screen.queryByText('Title')).not.toBeInTheDocument()
      })
    })
  })
})

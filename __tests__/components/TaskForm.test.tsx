import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskForm } from '@/components/TaskForm'

describe('TaskForm', () => {
  const mockOnSave = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the task form', () => {
    render(<TaskForm onSave={mockOnSave} />)

    expect(screen.getByPlaceholderText(/what needs to be done/i)).toBeInTheDocument()
  })

  it('expands when focused', async () => {
    const user = userEvent.setup()
    render(<TaskForm onSave={mockOnSave} />)

    const input = screen.getByPlaceholderText(/what needs to be done/i)
    await user.click(input)

    expect(screen.getByPlaceholderText(/add a description/i)).toBeInTheDocument()
    expect(screen.getByText('Add Task')).toBeInTheDocument()
  })

  it('disables submit button when title is empty', async () => {
    const user = userEvent.setup()
    render(<TaskForm onSave={mockOnSave} />)

    const input = screen.getByPlaceholderText(/what needs to be done/i)
    await user.click(input)

    const submitButton = screen.getByText('Add Task')
    expect(submitButton).toBeDisabled()
  })

  it('enables submit button when title is provided', async () => {
    const user = userEvent.setup()
    render(<TaskForm onSave={mockOnSave} />)

    const input = screen.getByPlaceholderText(/what needs to be done/i)
    await user.type(input, 'New Task')

    const submitButton = screen.getByText('Add Task')
    expect(submitButton).not.toBeDisabled()
  })

  it('calls onSave with task data when submitted', async () => {
    const user = userEvent.setup()
    render(<TaskForm onSave={mockOnSave} />)

    const input = screen.getByPlaceholderText(/what needs to be done/i)
    await user.type(input, 'New Task')

    const submitButton = screen.getByText('Add Task')
    await user.click(submitButton)

    expect(mockOnSave).toHaveBeenCalledWith({
      title: 'New Task',
      description: null,
      completed: false,
      dueDate: null,
      priority: 'MEDIUM'
    })
  })

  it('clears the form after submission', async () => {
    const user = userEvent.setup()
    render(<TaskForm onSave={mockOnSave} />)

    const input = screen.getByPlaceholderText(/what needs to be done/i)
    await user.type(input, 'New Task')

    const submitButton = screen.getByText('Add Task')
    await user.click(submitButton)

    expect(input).toHaveValue('')
  })

  it('allows setting priority', async () => {
    const user = userEvent.setup()
    render(<TaskForm onSave={mockOnSave} />)

    const input = screen.getByPlaceholderText(/what needs to be done/i)
    await user.type(input, 'High Priority Task')

    const highButton = screen.getByText('HIGH')
    await user.click(highButton)

    const submitButton = screen.getByText('Add Task')
    await user.click(submitButton)

    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({
        priority: 'HIGH'
      })
    )
  })
})

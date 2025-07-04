import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import Button from './Button'

// 取代原本的 Icon
jest.mock('../Icon', () => {
    type IconProps = { icon: string; size: string; className?: string }
    const MockIcon: React.FC<IconProps> = ({ icon, size, className }) => (
      <svg data-testid="icon" data-icon={icon} data-size={size} className={className} />
    )
    MockIcon.displayName = 'Icon'
    return MockIcon
})

describe('Component: Button', () => {
    it('should render children text', () => {
        render(<Button color="primary">Click me</Button>)
        expect(screen.getByText('Click me')).toBeInTheDocument()
    })

    it('應該帶進 leftIcon 和 rightIcon', () => {
        render(
        <Button leftIcon="solar:user-bold" rightIcon="solar:check-bold" color="zinc">
            Profile
        </Button>
        )
        // 兩個 icon 欄位都被渲染出來
        const icons = screen.getAllByTestId('icon')
        const realIcons = icons.filter((el)=> el.getAttribute('data-icon') !== 'solar:refresh-bold')
        expect(realIcons).toHaveLength(2)
        expect(realIcons[0]).toHaveAttribute('data-icon', 'solar:user-bold')
        expect(realIcons[1]).toHaveAttribute('data-icon', 'solar:check-bold')
    })

    it('disabled 時要有對應的樣式並且 onClick 不觸發', () => {
        const onClick = jest.fn()
        render(
        <Button disabled onClick={onClick} color="primary">
            Disabled
        </Button>
        )
        const btn = screen.getByRole('button', { name: 'Disabled' })
        // 屬性
        expect(btn).toBeDisabled()
        // clsx 生成了 cursor-not-allowed
        expect(btn).toHaveClass('cursor-not-allowed')
        fireEvent.click(btn)
        expect(onClick).not.toHaveBeenCalled()
    })

    it('isLoading 時，內容與左／右 icon 隱藏、並呈現 loading spinner', () => {
        render(
        <Button isLoading size="md" color="zinc">
            LoadingTest
        </Button>
        )
        // 內層文字和 icon 應該是 invisible
        const contentSpan = screen.getByText('LoadingTest')
        expect(contentSpan).toHaveClass('invisible')
        // loading spinner 可見
        const spinner = screen.getByTestId('icon') 
        expect(spinner).toHaveAttribute('data-icon', 'solar:refresh-bold')
        expect(spinner).toHaveClass('visible', 'animate-spin')
    })

    it('click 時若非 loading，應該呼叫 onClick', () => {
        const onClick = jest.fn()
        render(
        <Button isLoading={false} onClick={onClick} color="primary">
            Go
        </Button>
        )
        const btn = screen.getByRole('button', { name: 'Go' })
        fireEvent.click(btn)
        expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('type 屬性預設為 button，可改為 submit', () => {
        const { rerender } = render(<Button color="primary">X</Button>)
        const btn = screen.getByRole('button')
        expect(btn).toHaveAttribute('type', 'button')

        rerender(
        <Button type="submit" color="zinc">
            Submit
        </Button>
        )
        expect(screen.getByRole('button', { name: 'Submit' })).toHaveAttribute(
        'type',
        'submit'
        )
    })
})

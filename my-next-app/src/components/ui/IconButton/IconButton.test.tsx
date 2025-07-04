import React from "react";
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import IconButton from "@/components/ui/IconButton/IconButton";;
import type { IconProps } from '@phosphor-icons/react'



jest.mock('../Icon',()=>{
    type IconProps = {icon:string; size:string; className?:string}
    const MockIcon: React.FC<IconProps> = ({icon, size, className}) => (
        <svg data-testid="icon" data-icon={icon} data-size={size} className={className} />
    )
    MockIcon.displayName = 'Icon'
    return MockIcon
})

describe('Component: IconButton', () => {
    it('should render default iconButton', () => {
      render(<IconButton color="primary" />)
      const icons = screen.getAllByTestId('icon')
      const realIcon = icons.find((el)=> el.getAttribute('data-icon') !== 'solar:refresh-bold')
      expect(realIcon).toHaveAttribute('data-icon', 'solar:stop-outline') // default icon = 'solar:stop-outline'
      expect(realIcon).toHaveAttribute('data-size', 'md') // default size = 'sm' -> icon siz = 'md'
    })
  
    it('傳入自訂 string icon', () => {
      render(
        <IconButton
          icon="solar:user-bold"
          size="md"
          variant="outline"
          color="zinc"
        />
      )
      const icons = screen.getAllByTestId('icon')
      const realIcon = icons.find((el)=> el.getAttribute('data-icon') !== 'solar:refresh-bold')
      expect(realIcon).toHaveAttribute('data-icon', 'solar:user-bold')
      expect(realIcon).toHaveAttribute('data-size', 'lg') // iconSize="md" → 'lg'
    })
  
    it('傳入 Phosphor Icon Component 時應渲染那個 Component', () => {
      // 用一個 dummy component 來模擬 Phosphor icon
      const DummyPhIcon: React.FC<IconProps>= ({size, className}) => (
        <svg data-testid="phosphor-icon" data-size={size} className={className} />
      )
  
      render(
        <IconButton
          icon={DummyPhIcon}
          size="md"
          variant="text-button"
          color="primary"
        />
      )
      const ph = screen.getByTestId('phosphor-icon')
      expect(ph).toHaveAttribute('data-size', '28') // size="md" → 在 Content 裡 catIconSize = '28'
    })
  
    it('disabled 時要有對應樣式且 onClick 不觸發', () => {
      const onClick = jest.fn()
      render(
        <IconButton disabled onClick={onClick} color="primary">
          X
        </IconButton>
      )
      const btn = screen.getByRole('button')
      expect(btn).toBeDisabled()
      expect(btn).toHaveClass('cursor-not-allowed', 'pointer-events-none')
      fireEvent.click(btn)
      expect(onClick).not.toHaveBeenCalled()
    })
  
    it('isLoading 時，Content icon invisible，並顯示 loading spinner', () => {
      render(<IconButton isLoading size="sm" color="zinc" />)
      const allIcons = screen.getAllByTestId('icon')
      const contentIcon = allIcons.find(
        (el) => el.getAttribute('data-icon') !== 'solar:refresh-bold'
      )!
      expect(contentIcon).toHaveClass('invisible')
  
      // 再找 loading spinner
      const spinner = allIcons.find(
        (el) => el.getAttribute('data-icon') === 'solar:refresh-bold'
      )!
      expect(spinner).toHaveClass('visible', 'animate-spin')
    })
  
    it('非 loading 且可點擊時，click 應呼叫 onClick', () => {
      const onClick = jest.fn()
      render(
        <IconButton onClick={onClick} isLoading={false} color="primary" />
      )
      fireEvent.click(screen.getByRole('button'))
      expect(onClick).toHaveBeenCalledTimes(1)
    })
  
    it('type 屬性預設為 button，可改為 submit', () => {
      const { rerender } = render(<IconButton color="primary" />)
      const btn = screen.getByRole('button')
      expect(btn).toHaveAttribute('type', 'button')
  
      rerender(<IconButton type="submit" color="zinc" />)
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
    })
})
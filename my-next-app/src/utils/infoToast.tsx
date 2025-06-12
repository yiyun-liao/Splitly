import toast from 'react-hot-toast'
import Icon from '@/components/ui/Icon'

export function showInfoToast(text:string) {
  toast.custom((t) => (
    <div
      className={`
        ${t.visible ? 'animate-enter' : 'animate-leave'}
        gap-2 pr-4 pl-2 py-2 max-w-xs  shadow-lg rounded-xl pointer-events-auto flex items-center justify-start ring-1 ring-sp-grass-400 text-sp-grass-700 bg-white
      `}
    >
          <div className="shrink-0 ">
            <Icon icon="solar:danger-circle-bold" size="lg" className="text-sp-grass-700" />
          </div>
          <div className="flex-1 shrink-0">
            <p className="text-base">{text}</p>
          </div>
    </div>
  ))
}

import { Button, ButtonProps } from 'primereact/button'
import { FC } from 'react'

export const BigButton: FC<ButtonProps> = (props) => {
  return (
    <Button {...props} className="bg-transparent p-[5px] pb-2 relative group" text>
      <div className="relative w-full h-full shadow-2xl">
        <div className="bg-purple-700 absolute w-full h-full -translate-x-[5px] border-solid border-2 border-black shadow-down group-hover:bg-purple-600 transition-colors"></div>
        <div className="bg-purple-700 absolute w-full h-full translate-x-[5px] border-solid border-2 border-black shadow-down group-hover:bg-purple-600 transition-colors"></div>
        <div className="bg-purple-500 absolute w-full h-full -translate-y-[5px] border-solid border-2 border-black shadow-down group-hover:bg-purple-400 transition-colors"></div>
        <div className="bg-purple-800 absolute w-full h-full translate-y-[5px] border-solid border-2 border-black shadow-down group-hover:bg-purple-700 transition-colors"></div>
        <div className="bg-purple-600 relative px-10 py-3 group-hover:bg-purple-500 transition-colors">
          <span className="font-minecraft tracking-wider text-main text-shadow-down inline-block transform group-hover:scale-105 transition-transform duration-200">
            {props.children}
          </span>
        </div>
      </div>
    </Button>
  )
}

interface InputProps  extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    invalid? : boolean;
    type: string;
    errorMessage?: string;
}

export default function Input({label, invalid,errorMessage, ...props}:InputProps){
    let labelClasses = "block mb-2 text-base font-bold tracking-widest uppercase";
    let inputClasses = "w-full px-3 py-2 leading-tight border rounded shadow";
    if (invalid){
      labelClasses += " text-red-400";
      inputClasses += " test-red-500 bg-red-100 border-red-300"
    } else {
      labelClasses += " text-stone-700";
      inputClasses += " text-stone-700 bg-stone-50";
    }
    return (
      <div>
        <label className={labelClasses}>{label}</label>
        <input className={inputClasses} {...props}/>
        <div>
            <p className="text-red-400 mt-1 text-sm min-h-5">{errorMessage}</p>
        </div>
      </div>
    )
  }
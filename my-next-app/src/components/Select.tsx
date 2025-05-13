interface SelectProps  extends React.SelectHTMLAttributes<HTMLSelectElement> {
    id: string;
    label: string;
    invalid? : boolean;
    errorMessage?: string;
    optionData: { [key: string]: string };
    value: string;
}

export default function Select({id, label, invalid, value, optionData, errorMessage, ...props}:SelectProps){
    let labelClasses = "block mb-2 text-base font-bold tracking-widest uppercase";
    let selectClasses = "w-full px-3 py-2 leading-tight border rounded shadow";
    if (invalid){
      labelClasses += " text-red-400";
      selectClasses += " test-red-500 bg-red-100 border-red-300"
    } else {
      labelClasses += " text-stone-700";
      selectClasses += " text-stone-700 bg-stone-50";
    }
    return (
      <div>
        <label className={labelClasses}>{label}</label>
        <select name={id} id={id} className={selectClasses} value={value} {...props}>
            {Object.entries(optionData).map(([key, val]) => (
                <option  key={key} value={key}>{val}</option>
            ))}
        </select>
        <div>
            <p className="text-red-400 mt-1 text-sm min-h-5">{errorMessage}</p>
        </div>
      </div>
    )
  }
import Button from "@/components/lib/Button"
import ImageButton from "@/components/lib/ImageButton"
import ExpenseCard from "@/components/template/ExpenseCard";

interface ExpenseListProps {
    userData: {
      avatar?: string;
      name?: string;
    } | null;
  }

export default function ExpenseList({}:ExpenseListProps){
    return(
        <div id="expense-list" className="shrink-0 w-xl px-3 py-3 rounded-2xl h-full overflow-hidden bg-sp-green-300">
            <div id="expense-list-header"  className="py-2 px-4 flex items-center gap-2 w-full justify-between overflow-hidden">
                <p className="text-2xl font-medium whitespace-nowrap truncate min-w-0 max-w-100"> 收支紀錄</p>
                <Button
                    size='sm'
                    width='fit'
                    variant='solid'
                    color='primary'
                    leftIcon='solar:clipboard-add-linear'
                    //disabled={isdisabled} 
                    //isLoading={isLoading}
                    //onClick={handleClick} 
                    >
                        新增
                </Button> 
            </div>
            <div id="expense-list-frame" className="py-2 px-4 h-full overflow-y-auto overflow-x-hidden scrollbar-gutter-stable scrollbar-thin scroll-smooth">
                <div id="expense-list-frame-date" className="w-full pb-4">
                    <p className="text-sm pb-2 w-full font-semibold">05.11.2025</p>
                    <ExpenseCard/>
                    <div className="w-full h-0.25 bg-sp-green-200"></div>
                    <ExpenseCard/>
                    <div className="w-full h-0.25 bg-sp-green-200"></div>
                    <ExpenseCard/>
                </div>
                <div id="expense-list-frame-date" className="w-full pb-4">
                    <p className="text-sm pb-2 w-full font-semibold">05.11.2025</p>
                    <ExpenseCard/>
                    <div className="w-full h-0.25 bg-sp-green-200"></div>
                    <ExpenseCard/>
                    <div className="w-full h-0.25 bg-sp-green-200"></div>
                    <ExpenseCard/>
                </div>
                <div id="expense-list-frame-date" className="w-full pb-4">
                    <p className="text-sm pb-2 w-full font-semibold">05.11.2025</p>
                    <ExpenseCard/>
                    <div className="w-full h-0.25 bg-sp-green-200"></div>
                    <ExpenseCard/>
                    <div className="w-full h-0.25 bg-sp-green-200"></div>
                    <ExpenseCard/>
                </div>
            </div>
        </div>
    )
}
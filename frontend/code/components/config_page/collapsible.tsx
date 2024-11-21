import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type CollapsibleProps = {
    open : boolean,
    title : string,
    children : any
}

export default function Collapsible (
    { open, children, title } : CollapsibleProps ) {
        
  const [isOpen, setIsOpen] = useState(open);
  const [height, setHeight] = useState<string | number>(0);
  const ref = useRef<HTMLDivElement>(null);

  const handleFilterOpening = () => {
    setIsOpen((prev) => !prev);
  };

    useEffect(() => {
        if (isOpen) setHeight(ref.current?.getBoundingClientRect().height ? ref.current?.getBoundingClientRect().height : 0);
        else setHeight(0);
    }, [isOpen]);

  return (
      <div className="card">
        <div>
          <div className="p-3 w-full border-b-2 border-gray-200 ">
            <button
                type="button" 
                className="justify-between w-full flex" 
                onClick={handleFilterOpening}>
                <h6 className="font-weight-bold">{title}</h6>
                    {!isOpen ? (
                        <ChevronDown />
                    ) : (
                        <ChevronUp />
                    )}
            </button>
          </div>
        </div>

        <div className="overflow-hidden transition-all duration-300"
            style = {{height: `${height}px`}}>
          {/* <div>
            {isOpen && 
            <div 
                ref={ref}
                className="p-3 border-b-2 border-gray-200 space-y-6">{children}</div>}</div> */}
            <div 
                ref={ref}
                className="p-3 border-b-2 border-gray-200 space-y-6">{children}
            </div>
        </div>
      </div>
  );
};


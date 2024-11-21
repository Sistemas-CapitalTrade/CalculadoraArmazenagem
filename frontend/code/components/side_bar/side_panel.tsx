import React, { useState } from "react"
import { SideBarButton } from "../side_bar/side_bar_button";
import { Panel } from "@/data/types";
type SidePanelProps = {
    selectedPanel: (selected_panel : Panel | null) => void;
    panels : Panel[]
  };
export default function SidePanel({
    selectedPanel,
    panels
} : SidePanelProps) {

    const [panelSelected,setPanelSelected] = useState<Panel | null>(null)

    function getSideBarSelectValue ( input_value : Panel) {
        //Deseleciona o painel
        
        if(panelSelected && panelSelected.id == input_value.id){
            
            setPanelSelected(null);
            selectedPanel(null)
            return
        
        }
        setPanelSelected(input_value);
        selectedPanel(input_value)
        return
    }

    return (    
        <div className="font-inter mt-24 p-4 items-center pt-12 w-[20rem] h-min border-r-2 border-gray-400 text-white">
            <div className="space-y-8 mx-auto">
                {panels.map( panel => {
                    return <SideBarButton
                                key={panel.id}
                                value={panel}
                                selectValue={getSideBarSelectValue}
                                selectedValue={panelSelected}
                            >

                    </SideBarButton>
                })

                }      
            </div>
        </div>
    );
}

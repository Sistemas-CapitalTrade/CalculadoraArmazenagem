import { Panel, RecintoInfoType } from "@/data/types";
import PeriodosPage from "./pages/periodos_page"
import TaxasPage from "./pages/taxas_page"
import TarifasPage from "./pages/tarifas_page"
import LevantePage from "./pages/levante_page"
import NegociacaoPage from "./pages/negociacao_page"
import ServicosPage from "./pages/servicos_page"

type ConfigRendererProps = {
    selectValue : (input_value : any) => void,
    recintoInfo : RecintoInfoType,
    selectedPanel? : Panel | null,
    tipoMercadoria : string[],
    tipoConteiner : string[]
}



export function ConfigRenderer({
    selectValue,
    recintoInfo,
    selectedPanel,
    tipoMercadoria,
    tipoConteiner
} : ConfigRendererProps){

    function handleReturnedValue (return_value : any){
        selectValue(return_value)
    }

    return(
        <div className="mx-auto w-full p-4">
            {
                {
                    'periodos': <PeriodosPage currentValues={recintoInfo.periodos} returnedValue={handleReturnedValue} />,
                    'taxa': <TaxasPage currentValues={recintoInfo.taxa_padrao} tipoMercadoria={tipoMercadoria} returnedValue={handleReturnedValue}/>,
                    'tarifas': <TarifasPage currentValues={recintoInfo.tarifas} returnedValue={handleReturnedValue}/>,
                    'servicos' : <ServicosPage currentValues={recintoInfo.custos_adicionais_conteiner} input_key="custos_adicionais_conteiner" returnedValue={handleReturnedValue}/>,
                    'levante' : <LevantePage currentValues={recintoInfo.levante} tipoConteiner={tipoConteiner} returnedValue={handleReturnedValue}/>,
                    'negociacao' : <NegociacaoPage currentValues={recintoInfo.taxas_negociadas} tipoMercadoria={tipoMercadoria} returnedValue={handleReturnedValue}/>,
                    'padrao' : null,
                    
                    }[selectedPanel ? selectedPanel.id : 'padrao']
            }
        </div>
    )
}
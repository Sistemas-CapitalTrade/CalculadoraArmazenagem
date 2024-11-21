import React from "react"

type CardContentprops = {
    headerTitle : string;
    InnerContentComponent : React.ElementType 
}
type Backgroundprops = {
    ContentComponent: React.ElementType;
    InnerProps : CardContentprops;
  };
const assetPrefix = process.env.NEXT_PUBLIC_ASSET_PREFIX;
export default function Background({
    ContentComponent,
    InnerProps
} : Backgroundprops) {
  
  return (    
    <div className="w-screen h-screen overflow-auto bg-fixed bg-cover bg-no-repeat" style={{backgroundImage: `url('${assetPrefix}/images/background_CT_2024.png')`}}>

        <ContentComponent headerTitle = {InnerProps.headerTitle} ContentComponent = {InnerProps.InnerContentComponent}/>

        <div className="h-40"></div>

    </div>
  );
}

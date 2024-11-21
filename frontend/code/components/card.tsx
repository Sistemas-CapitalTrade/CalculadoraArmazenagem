'use client'
import React, { useState } from "react"
import Image from "next/image"

type ContentComponentProps = {
  returnRecinto? : (recinto_name : string) => void
}
type Cardprops = {
    ContentComponent?: React.ComponentType<ContentComponentProps>;
    headerTitle : string;
  };

const assetPrefix = process.env.NEXT_PUBLIC_ASSET_PREFIX;
export default function Card({
    ContentComponent,
    headerTitle
} : Cardprops) {
  const [recintoName, setRecintoName] = useState<string>("")
  
  function handleRecintoNameSelection (recinto_name : string) {

    setRecintoName(recinto_name)
  }
  
  return (    
    <div className="bg-gray-900 shadow-2xl bg-opacity-50 mx-auto p-8 pt-12 rounded-xl mt-24 h-min w-11/12  text-white">
        <div className="flex w-full justify-between items-center">
          <Image
          alt = "ct_icon"
          className="object-fit h-24 w-72"
          src = {`${assetPrefix}/images/logo_sistemas_01.png`}
          width={9000}
          height={9000}
          />
          <h1 className="w-min text-nowrap font-inter font-bold text-2xl">{headerTitle}</h1>
          
          {
            recintoName == "" 
            ?
            <div className="h-24 w-48"></div>
            :
            <Image
            alt = "recinto_logo"
            className="object-fit h-24 w-48"
            src = {`${assetPrefix}/images/Recintos/${recintoName}.png`}
            width={9000}
            height={9000}
            />
          }

        </div>
        {ContentComponent ? <ContentComponent returnRecinto={handleRecintoNameSelection} /> : <p>nada</p>}

    </div>
  );
}

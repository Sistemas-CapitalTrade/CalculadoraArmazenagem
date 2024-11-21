import React from "react"
import Image from "next/image"
type Cardprops = {
    ContentComponent?: React.ComponentType;
    headerTitle : string;
  };
export default function Card({
    ContentComponent,
    headerTitle
} : Cardprops) {
  return (    
    <div className="bg-gray-900 shadow-2xl bg-opacity-50 mx-auto p-8 pt-12 rounded-xl mt-24 h-min w-11/12  text-white">
        <div className="flex w-full justify-between items-center">
            <h1 className="w-min text-nowrap font-inter font-bold text-2xl">{headerTitle}</h1>
            <Image
            alt = "ct_icon"
            className="object-fit h-24 w-72"
            src = "/images/logo_sistemas_01.png"
            width={9000}
            height={9000}
            />
        </div>
        {ContentComponent ? <ContentComponent/> : <p>nada</p>}

    </div>
  );
}

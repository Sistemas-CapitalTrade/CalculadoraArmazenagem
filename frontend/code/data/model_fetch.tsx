import { InputLabelForm } from "./types"

export async function fetchInputForm(url : string){
    return await fetch(url)
        .then( response => {
            if(!response.ok)
                throw new Error('Network response was not ok')
            return response.json()
        })
        .then( data => {
            let InputsLabel : InputLabelForm[]

            if(Array.isArray(data) && data.length > 0 && data.every(item => typeof item === "string")){
                InputsLabel = convertDataStringsToInputLabel(data) 
            } else {
                InputsLabel = convertDataObjectsToInputLabel(data)
            }

            return InputsLabel  
        })
} 

export async function DefaultGetFetch(url : string) {
    return fetch(url)
    .then(response => {
      if (!response.ok) {
        return response.json().then(errData => {
          throw new Error(errData.error || 'Unknown error occurred');
      });
      }
      return response.json();
    })
    .then(data => {
        return data
    })
    .catch(error => {
      console.error('Error:', error.message);

        // Handle error (e.g., show an error message)
    });
}

function convertDataStringsToInputLabel(data : string[]){ 
    return data.map((item: string)=>({
            id: item    ,
            label: item
        }))
}
function convertDataObjectsToInputLabel(data : any[]){ 
    return data.map((item: any)=>({
            id: item.id,
            label: item.nome
        }))
}
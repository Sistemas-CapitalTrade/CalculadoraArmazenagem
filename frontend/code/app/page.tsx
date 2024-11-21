import Background from "@/components/background";
import Card from "@/components/card";
import Form from "@/components/conteiner_form"

const innerProps = {
  headerTitle : "CAPITAL CALCULATOR ANALYTICS - CCA",
  InnerContentComponent : Form
}
// Playlist necessária para escutar enquanto programa
// https://youtu.be/GvD3CHA48pA
// https://music.youtube.com/watch?v=iYcbfc_UB6M&list=RDAMVMDXQ4sU6KK-I
export default function Home() {
  return (
    <Background 
      ContentComponent={Card} InnerProps={innerProps}
    >
    </Background>
  );
}
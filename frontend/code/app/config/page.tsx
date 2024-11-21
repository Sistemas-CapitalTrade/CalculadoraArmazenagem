import Config from "@/components/config_form";
import Background from "@/components/background";
import Card from "@/components/card";

const innerProps = {
  headerTitle : "CONFIGURAÇÃO DE RECINTOS",
  InnerContentComponent : Config
}

export default function Home() {
  return (
    <Background 
    ContentComponent={Card} InnerProps={innerProps}
    >
    </Background>
  );
}
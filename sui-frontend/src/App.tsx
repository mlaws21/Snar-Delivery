import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Flex, Heading} from "@radix-ui/themes";
// import { WalletStatus } from "./WalletStatus";
import Home from "./components/Home";
import "./App.css"
// import mast from "./images/masthead.png"

function App() {
  return (
    <>
      <Flex
        position="sticky"
        px="4"
        py="2"
        justify="between"
        style={{
          borderBottom: "1px solid rgba(106, 106, 106, 0.2)",
        }}
      >
        <Box>
          <Heading className="header">Snar Delivery</Heading>
          {/* <img className="mast" src={mast}></img> */}
        </Box>

        <Box>
          <ConnectButton />
        </Box>
      </Flex>
        <Home />

    </>
  );
}

export default App;

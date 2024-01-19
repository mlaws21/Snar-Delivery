import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Flex, Heading } from "@radix-ui/themes";
// import { WalletStatus } from "./WalletStatus";
import Home from "./components/Home";

function App() {
  return (
    <>
      <Flex
        position="sticky"
        px="4"
        py="2"
        justify="between"
        style={{
          borderBottom: "1px solid var(--gray-a2)",
        }}
      >
        <Box>
          <Heading>Snar Delivery</Heading>
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

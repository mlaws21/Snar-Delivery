import { useState } from 'react';
import RequestForm from "./RequestForm";
import "./style/Home.css"

import { TransactionBlock } from "@mysten/sui.js/transactions";
import { SUI_SYSTEM_STATE_OBJECT_ID } from '@mysten/sui.js/utils';

import {
  useSignAndExecuteTransactionBlock,
  useSuiClient,
} from "@mysten/dapp-kit";
import { SuiObjectData } from "@mysten/sui.js/client";
import { useGetReqBoard } from '../useGetReqBoard';

interface Request {
    name: string;
    building: string;
    room: string; 
    swipe: boolean;
    food: string;
    price: number;

}

interface RequestComponentProps {
    request: Request;
}

const RequestComponent: React.FC<RequestComponentProps> = ({ request }) => {
    
  const fulfillRequest = () => {
    console.log("req fufilled")
  }

    return (
        <div className="vertical-bar">
        <div className="wrapper"><p className="field">Name: {request.name}</p></div> 
        <div className="wrapper"><p className="field">Building: {request.building}</p></div>
        <div className="wrapper"><p className="field">Room: {request.room}</p></div>
        <div className="wrapper"><p className="field">Swipe: {request.swipe ? 'Yes' : 'No'}</p></div>
        <div className="wrapper"><p className="field">Food: {request.food}</p></div>
        <div className="wrapper"><p className="field">Price: {request.price}</p></div>
        <div className="wrapper"><button id="fulfill" className="field" onClick={fulfillRequest}>Fulfill Request</button></div>


        
        </div>
    )
}

interface MyComponentProps {
  // Define your component props here
}

const Form: React.FC<MyComponentProps> = ({ /* Destructure props if needed */ }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const sampleRequest: Request = {
    name: 'John',
    building: 'Main Building',
    room: '101',
    swipe: true,
    food: 'Pizza',
    price: 10,
  };

  const toggleOpenClose = () => {
    setIsOpen(!isOpen);
  };

  const client = useSuiClient();
  const { mutate: signAndExecuteTransactionBlock } =
  useSignAndExecuteTransactionBlock();

  // const { handleGetReqBoard } = useGetReqBoard();
  // const { data, isLoading, error, refetch } = handleGetReqBoard();


  const handleRequestSubmit = (request: Request) => {
    // Do something with the submitted request
    let txb = new TransactionBlock();

    txb.setGasBudget(10000000);

    const [coin] = txb.splitCoins(txb.gas, [1]);

    txb.moveCall({
      target: `0x2c5d0d91e5d756b6a768ec2eaecb7a75252a1e9284601f090dbc81fe011bbfd9::request::add_request`,
      arguments: [
        // txb.sharedObjectRef(
        //   { objectId: "0xc55e73600a6f152a6be8a3709c54c13473dda519d789ce639b5c6f738db01b49",
        //   initialSharedVersion: 825422,
        //   mutable: true }
        //   // `0x397958187cf47b9632944fc6e81ca999a2c51a0d5a3fd3e2904d580d45920c17`,
        // ),
        txb.object(
          "0xc55e73600a6f152a6be8a3709c54c13473dda519d789ce639b5c6f738db01b49"
        ),
        txb.pure(request.name),
        txb.pure(request.building),
        txb.pure(request.room),
        txb.pure(request.swipe),
        txb.pure(request.food),
        coin,
        txb.pure(false),
      ],
    })

    console.log(txb.serialize)

    signAndExecuteTransactionBlock(
      {
        transactionBlock: txb,
        chain: "sui:testnet",
      },
      {
        onSuccess: (tx) => {
          console.log(tx);
          // setDeltas(new Set());
          client.waitForTransactionBlock({ digest: tx.digest }).then(() => {
            // refetch();
          });
        },
        onError: (err) => {
          console.log(err);
        },
      },
    );
    console.log('Submitted Request:', request);
  };

  return (
    <div id="main">
      <button id="toggle" onClick={toggleOpenClose}>
        {/* {isOpen ? 'Close' : 'Open'} Form */}
        {isOpen ? "x" : '+'}

      </button>
      
      {isOpen ? (
        <div>
          {/* Content to display when the component is open */}
          <RequestForm onSubmit={handleRequestSubmit} />

        </div>
      ) : <RequestComponent request={sampleRequest}/>}
    </div>
  );
};



const Home = () => {



    return (
        <div>
            {/* <RequestComponent request={sampleRequest} /> */}
            <Form />
            {/* <RequestForm onSubmit={handleRequestSubmit} /> */}
        </div>
    )
}

export default Home
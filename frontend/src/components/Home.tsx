import React, { useState } from 'react';
import RequestForm from "./RequestForm";
import "./style/Home.css"

import { TransactionBlock } from "@mysten/sui.js/transactions";
import {
  useSignAndExecuteTransactionBlock,
  useSuiClient,
} from "@mysten/dapp-kit";
import { SuiObjectData } from "@mysten/sui.js/client";

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


  // self: &mut RequestBoard,
  // // payment: &mut Coin<SUI>,
  // // req: Request,
  // my_name: String,
  // my_building: String, 
  // my_room: String,
  // my_swipe: bool,
  // my_food: String,
  // // price: Balance<SUI>,
  // // payment: Coin<SUI>,
  // my_payment: Balance<SUI>,
  // // price: u64,
  // my_fulfilled: bool,
  // ctx: &mut TxContext,



  const handleRequestSubmit = (request: Request) => {
    // Do something with the submitted request
    let transactionBlock = new TransactionBlock();
    transactionBlock.moveCall({
      target: `0x887caacf959851a5fa2438014e3698ce666a2d88ba9e5969f2a502d4cba6d701::request::add_request`,
      arguments: [
        transactionBlock.object(
          `0x397958187cf47b9632944fc6e81ca999a2c51a0d5a3fd3e2904d580d45920c17`,
        ),
        transactionBlock.pure(request.name),
        transactionBlock.pure(request.building),
        transactionBlock.pure(request.room),
        transactionBlock.pure(request.swipe),
        transactionBlock.pure(request.food),
        // TODO: my_payment
        transactionBlock.pure(false),
        // TODO: my_ctx maybe dont need

        
          



        // transactionBlock.pure(newDeltas[idx][0]),
        // transactionBlock.pure(newDeltas[idx][1]),
        // transactionBlock.pure(
        //   localGrid[newDeltas[idx][0]][newDeltas[idx][1]],
        // ),
      ],
    })
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
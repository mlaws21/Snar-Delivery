import { useState, useEffect } from 'react';
import RequestForm from "./RequestForm";
import "./style/Home.css"
import type { SuiMoveObject, } from '@mysten/sui.js/client';

import { TransactionBlock } from "@mysten/sui.js/transactions";
import { SUI_SYSTEM_STATE_OBJECT_ID } from '@mysten/sui.js/utils';

import {
  useCurrentAccount,
  useSignAndExecuteTransactionBlock,
  useSuiClient,
} from "@mysten/dapp-kit";
import { SuiObjectData, getFullnodeUrl, SuiClient, SuiParsedData } from "@mysten/sui.js/client";
import { useGetReqBoard } from '../useGetReqBoard';

const PACKAGE = "0x210121e3ab3e913f8f12f20d937b0c43fc7e0556fd0405ad40462d2785705e87"
const BOARD_OBJ = "0x6a82c4ea99f96c6dbcea4fb485142ae55c37d23981384fe14f0a7c2f8498a04f"
const BOARD = "0xdc08a66b57cc065f6038e362bb6b25a52904c69cf04e05eb2bcb1f318abbab0d"



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


interface DataTableProps {
  data: {
    dynamicFieldId: string;
    name: string;
    building: string;
    room: string;
    swipe: string;
    food: string;
    price: string;
  }[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const { mutate: signAndExecuteTransactionBlock } =
  useSignAndExecuteTransactionBlock();

  const { handleGetReqBoard } = useGetReqBoard();
  const { refetch } = handleGetReqBoard();


  const fulfillRequest = (requestNum: number) => {
    // Do something with the submitted request
    let txb = new TransactionBlock();

    // const [coin] = txb.splitCoins(txb.gas, [1]);

    const [payment] = txb.moveCall({
      target: `${PACKAGE}::request::fulfill_request`,
      arguments: [
        txb.object(
          BOARD_OBJ
        ),
        txb.pure(requestNum),
      ],
    })

    
    txb.transferObjects([payment], account?.address || "")
    // txb.mergeCoins()

    signAndExecuteTransactionBlock(
      {
        transactionBlock: txb,
        chain: "sui:testnet",
      },
      {
        onSuccess: (tx) => {
          console.log(tx);
          client.waitForTransactionBlock({ digest: tx.digest }).then(() => {
            refetch();
          });
        },
        onError: (err) => {
          console.log(err);
        },
      },
    );

  };


  return (
    <div className="vertical-bar">
    <div className="wrapper"><p className="field">Name: {data.name}</p></div> 
    <div className="wrapper"><p className="field">Building: {data.building}</p></div>
    <div className="wrapper"><p className="field">Room: {data.room}</p></div>
    <div className="wrapper"><p className="field">Swipe: {data.swipe ? 'Yes' : 'No'}</p></div>
    <div className="wrapper"><p className="field">Food: {data.food}</p></div>
    <div className="wrapper"><p className="field">Price: {data.price}</p></div>
    <div className="wrapper"><button id="fulfill" className="field" onClick={() => fulfillRequest(1)}>Fulfill Request</button></div>
    </div>
    // <div>
    //   {data.map((rowData, index) => (
    //     <div key={index}>
    //       {/* <p>Dynamic Field id = {rowData.dynamicFieldId}</p> */}
    //       <p>name: {rowData.name}</p>
    //       <p>building: {rowData.building}</p>
    //       <p>Room: {rowData.room}</p>
    //       <p>Swipe: {rowData.swipe}</p>
    //       <p>Food: {rowData.food}</p>
    //       <p>Price: {rowData.price}</p>
    //       <hr />
    //     </div>
    //   ))}
    // </div>
  );
};

const RequestComponent: React.FC<RequestComponentProps> = ({ request }) => {
  
  const client = useSuiClient();
  const { mutate: signAndExecuteTransactionBlock } =
  useSignAndExecuteTransactionBlock();
  // user = getAdress
  const { handleGetReqBoard } = useGetReqBoard();
  const { data, isLoading, error, refetch } = handleGetReqBoard();






  const [tableData, setTableData] = useState<{
    name: string;
    building: string;
    room: string;
    swipe: string;
    food: string;
    price: string;
  }[]>([]);


  const useGetTable = async () => {
    try {
      const dynamicFieldPage = await client.getDynamicFields({ parentId: BOARD });
      const resultData = dynamicFieldPage.data;

      const promises = resultData?.map(async (tableRowResult) => {
        const poolId = tableRowResult.objectId;
        try {
          const dynFieldForPool = await client.getObject({
            id: poolId,
            options: { showContent: true },
          });

          const poolFields = (dynFieldForPool.data.content as SuiMoveObject).fields.value.fields;

          return {
            // dynamicFieldId: dynFieldForPool.data.objectId,
            name: poolFields["name"],
            building: poolFields["building"],
            room: poolFields["room"],
            swipe: poolFields["swipe"],
            food: poolFields["food"],
            price: poolFields["price"],
          };
        } catch (error) {
          console.error('Error fetching dynamic field:', error);
          throw error;
        }
      });

      const data = await Promise.all(promises || []);
      setTableData(data);
    } catch (error) {
      console.error('Error fetching dynamic fields:', error);
    }
  };
  
  // const fetchData = async () => {
  //   try {
  //     const data = await useGetTable();
  //     console.log(data)
  //     return (
  //       data
  //     )
  //     // Use the data as needed
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // };
  useEffect(() => {
    // Initial data fetch
    useGetTable();

    // Set up interval to refresh every 5 seconds
    const intervalId = setInterval(() => {
      useGetTable();
    }, 1000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  
  console.log(tableData)
  // fetchData()
  // Call fetchData somewhere in your code

  
  // const TableData = useGetTable()
  // useEffect(() => {
  //   if (!isLoading && !error && data?.data) {
  //     console.log(data)
  //     const currTable = getTable(data.data);
  //     console.log(currTable)
  //     // const currentCanvas = getArrayFields(data.data);
  //     // setGridColors(currentCanvas);
  //     // if (length !== currentCanvas.length) {
  //     //   setLength(currentCanvas.length);
  //     //   if (currentCanvas) {
  //     //     // Create a new grid with the same dimensions as currentCanvas
  //     //     const newLocalGrid = Array.from(
  //     //       { length: currentCanvas.length },
  //     //       () => Array(currentCanvas[0].length).fill("0"),
  //     //     );

  //     //     setLocalGrid(newLocalGrid);
  //     //   }
  //     // }
  //   }
  // }, [data, isLoading, error]);

  // const fulfillRequest = () => {
    
  //   console.log("req fufilled")
  // }

    return (
        <div>
        {/* <div className="vertical-bar">
        <div className="wrapper"><p className="field">Name: {request.name}</p></div> 
        <div className="wrapper"><p className="field">Building: {request.building}</p></div>
        <div className="wrapper"><p className="field">Room: {request.room}</p></div>
        <div className="wrapper"><p className="field">Swipe: {request.swipe ? 'Yes' : 'No'}</p></div>
        <div className="wrapper"><p className="field">Food: {request.food}</p></div>
        <div className="wrapper"><p className="field">Price: {request.price}</p></div>
        <div className="wrapper"><button id="fulfill" className="field" onClick={fulfillRequest}>Fulfill Request</button></div>
        </div> */}
        {tableData.map((rowData, index) => (

          <DataTable key={index} data={rowData} />
        ))
        }
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

  const { handleGetReqBoard } = useGetReqBoard();
  const { data, isLoading, error, refetch } = handleGetReqBoard();


  const handleRequestSubmit = (request: Request) => {
    // Do something with the submitted request
    let txb = new TransactionBlock();

    // txb.setGasBudget(10000000);

    const [coin] = txb.splitCoins(txb.gas, [request.price]);

    txb.moveCall({
      target: `${PACKAGE}::request::add_request`,
      arguments: [
        txb.object(
          BOARD_OBJ
        ),
        txb.pure(request.name),
        txb.pure(request.building),
        txb.pure(request.room),
        txb.pure((request.swipe) ? "Yes" : "No"),
        txb.pure(request.food),
        coin,
        txb.pure(String(request.price))
      ],
    })

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
            refetch();
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

function getTable(data: SuiObjectData) {
  if (data.content?.dataType !== "moveObject") {
    throw new Error("Content not found");
  }

  const { request_created } = data.content.fields as { request_created: any };
  return request_created;
}

export default Home
import { useState, useEffect } from 'react';
import RequestForm from "./RequestForm";
import "./style/Home.css"
import type { SuiMoveObject, } from '@mysten/sui.js/client';

import { TransactionBlock } from "@mysten/sui.js/transactions";

import {
  useCurrentAccount,
  useSignAndExecuteTransactionBlock,
  useSuiClient,
} from "@mysten/dapp-kit";
import { SuiObjectData, } from "@mysten/sui.js/client";
import { useGetReqBoard } from '../useGetReqBoard';

const PACKAGE = "0xa09f575cb98831bbe860866c80b9f5e24adce17a18a1b17a6d0eee35c6f6d092"
const BOARD_OBJ = "0xc0ea9614391529f12cb850c97e6c7c3a1204cf34e1787fdb889f3207819baf4a"
const BOARD = "0x332ec813b8423ee120c4dcb009e1ec766db7becabcf4049671d2633220a59486"
const CONVERSION = 1000000000

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


type DataTableItem = {
  // data: {
    id: number;
    name: string;
    building: string;
    room: string;
    swipe: string;
    food: string;
    price: string;
  // }[];
}

type DataTableProps = {
  data: DataTableItem[];
};

const DataTable: React.FC<DataTableProps>= ({ data }) => {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const { mutate: signAndExecuteTransactionBlock } =
  useSignAndExecuteTransactionBlock();

  const { handleGetReqBoard } = useGetReqBoard();
  const { refetch } = handleGetReqBoard();


  const fulfillRequest = (requestNum: number) => {
    // Do something with the submitted request
    let txb = new TransactionBlock();

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
    <div className="wrapper"><p className="field">Price: {(data.price)}</p></div>
    <div className="wrapper"><button id="fulfill" className="field" onClick={() => fulfillRequest(data.id)}>Fulfill Request</button></div>
    </div>

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
            id: poolFields["key"],
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

  


    return (
        <div>

        {tableData.length > 0 ? tableData.map((rowData, index) => (
          <DataTable key={index} data={rowData} />
        )) : <p>No Current Requests</p>
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



    const [coin] = txb.splitCoins(txb.gas, [request.price * CONVERSION]);

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
          client.waitForTransactionBlock({ digest: tx.digest }).then(() => {
            refetch();
          });
        },
        onError: (err) => {
          console.log(err);
        },
      },
    );
    toggleOpenClose();
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
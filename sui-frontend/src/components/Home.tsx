import { useState, useEffect } from 'react';
import RequestForm from "./RequestForm";
import "./style/Home.css"
import type { SuiObjectData } from '@mysten/sui.js/client';

import { TransactionBlock } from "@mysten/sui.js/transactions";

import {
  useCurrentAccount,
  useSignAndExecuteTransactionBlock,
  useSuiClient,
} from "@mysten/dapp-kit";
import { useGetReqBoard } from '../useGetReqBoard';

const PACKAGE = "0xa09f575cb98831bbe860866c80b9f5e24adce17a18a1b17a6d0eee35c6f6d092"
const BOARD_OBJ = "0xc0ea9614391529f12cb850c97e6c7c3a1204cf34e1787fdb889f3207819baf4a"
const BOARD = "0x332ec813b8423ee120c4dcb009e1ec766db7becabcf4049671d2633220a59486"
const CONVERSION = 1000000000

interface Request {
    id: number;
    name: string;
    building: string;
    room: string; 
    swipe: boolean;
    food: string;
    price: number;

}


type DataTableItem = {
    id: number;
    name: string;
    building: string;
    room: string;
    swipe: string;
    food: string;
    price: string;

}

type DataTableProps = {
  myData: DataTableItem[];
};


// SECTION Data Table
// This is table that is displayed in the Request Board
// Infrastructure for the Request Board
// Sets up the fulfill request transaction

const DataTable: React.FC<DataTableProps>= ({ myData }) => {

  // NOTE Transaction Block - Fulfill

  const account = useCurrentAccount();
  const client = useSuiClient();
  const { mutate: signAndExecuteTransactionBlock } =
  useSignAndExecuteTransactionBlock();

  const { handleGetReqBoard } = useGetReqBoard();
  const { refetch } = handleGetReqBoard();

  //  NOTE Fulfill Request Function
  const fulfillRequest = (requestNum: number) => {
    
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
          console.log("something went wrong in fulfil");
          console.log(err);
        },
      },
    );
  };

  // NOTE Sorting

  const [selectedValue, setSelectedValue] = useState('');
  const [sortedData, setSortedData] = useState<DataTableItem[]>(myData);

  useEffect(() => {
    switch (selectedValue) {
      case 'id':
        setSortedData([...myData].sort((a, b) => b.id - a.id));
        break;
      case 'price':
        setSortedData([...myData].sort((a, b) => parseInt(a.price) - parseInt(b.price)));
        break;
      case 'name':
        setSortedData([...myData].sort((a, b) => b.name.localeCompare(a.name)));
        break;
      case 'dropoff':
        setSortedData([...myData].sort((a, b) => a.room.localeCompare(b.room)));

        break;
      case 'food':
        setSortedData([...myData].sort((a, b) => a.food.localeCompare(b.food)));
        break;
      default:
        setSortedData([...myData].sort((a, b) => b.id - a.id));
        break;
    };
  }, []); 

  useEffect(() => {
    switch (selectedValue) {
      case 'id':
        setSortedData([...myData].sort((a, b) => b.id - a.id));
        break;
      case 'price':
        setSortedData([...myData].sort((a, b) => parseInt(b.price) - parseInt(a.price)));
        break;
      case 'name':
        setSortedData([...myData].sort((a, b) => a.name.localeCompare(b.name)));
        break;
      case 'dropoff':
        setSortedData([...myData].sort((a, b) => a.room.localeCompare(b.room)));
        break;
      case 'food':
        setSortedData([...myData].sort((a, b) => a.food.localeCompare(b.food)));
        break;
      default:
        setSortedData([...myData].sort((a, b) => b.id - a.id));
        break;
    }
  }, [selectedValue, myData]);
  // Handler function for changing the selected value
  const handleDropdownChange = (event:any) => {
    setSelectedValue(event.target.value);

  };
  
  //NOTE HTML

  return (
    <div>
      {myData.length > 0 ? (
      <div>
        <div className="filter">
          <p className="sortLab">Sort by:</p>
          <select id="myDropdown" value={selectedValue} onChange={handleDropdownChange}>
            <option value="id">Time</option>
            <option value="price">Price</option>
            <option value="name">Name</option>
            <option value="dropoff">Drop-off</option>
            <option value="food">Food</option>

          
          </select>
        </div>
      <div className='board'>
       

        {sortedData.map((rowData: DataTableItem) => (
        <div key={rowData.id} className="vertical-bar">

            <div className="wrapper"><p className="field">Name: {rowData.name}</p></div>
            <div className="wrapper"><p className="field">Time: {rowData.building}</p></div>
            <div className="wrapper"><p className="field">Drop-off: {rowData.room}</p></div>
            <div className="wrapper"><p className="field">Prepaid: {rowData.swipe}</p></div>
            <div id="food" className="wrapper"><p className="field">Food: {rowData.food}</p></div>
            <div className="wrapper"><p className="field">Price: {rowData.price} <span className="sui">SUI</span></p></div>
            <div className="wrapper"><button id="fulfill" className="field" onClick={() => fulfillRequest(rowData.id)}>Fulfill Request</button></div>
        </div>
      ))}
      </div>

    </div>) : (<div>
        <p className='noRequests'>No Pending Requests...</p>
        <p className='noRequests'>Click the Plus to add a Request!</p>

      
      </div>)
    }
    </div>

  );
};

//!SECTION


// SECTION Request Board

// sets up the request board 
// fetches the data off the blockchain to pass to the data table
const RequestBoard = () => {
  
  const client = useSuiClient();

  const [tableData, setTableData] = useState<{
    id: number;
    name: string;
    building: string;
    room: string;
    swipe: string;
    food: string;
    price: string;
  }[]>([]);

  // NOTE fetches table
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
          // const poolFields = (dynFieldForPool.data?.content as SuiMoveObject)?.fields.value.fields;
          const poolFields = getTableDate(dynFieldForPool.data!)
          

          // return m
          return poolFields;
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
  
  const fetchData = async () => {
    await useGetTable();
  };

  useEffect(() => {
    fetchData();

    // Set up interval to refresh every 0.5 seconds
    const intervalId = setInterval(() => {
      fetchData();
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  

    // NOTE HTML
    return (
      <div>

        <DataTable myData={tableData} />

      </div>
    )
}

//!SECTION

// SECTION Home
// Driver code
// also sets up the infrastructure for submitting requests
const Home = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleOpenClose = () => {
    setIsOpen(!isOpen);
  };

  const client = useSuiClient();
  const { mutate: signAndExecuteTransactionBlock } =
  useSignAndExecuteTransactionBlock();

  const { handleGetReqBoard } = useGetReqBoard();
  const { refetch } = handleGetReqBoard();

  // NOTE Submit Request Function
  const handleRequestSubmit = (request: Request) => {

    const now = new Date();
    const hours = now.getHours() % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, '0')
    const ampm = now.getHours() >= 12 ? 'pm' : 'am';

    const formattedTime = `${hours}:${minutes}${ampm}`;

    // NOTE Transaction Block - Request

    let txb = new TransactionBlock();
    console.log(formattedTime);

    const [coin] = txb.splitCoins(txb.gas, [request.price * CONVERSION]);

    txb.moveCall({
      target: `${PACKAGE}::request::add_request`,
      arguments: [
        txb.object(
          BOARD_OBJ
        ),
        txb.pure(request.name),
        txb.pure(formattedTime),
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
          console.log("something went wrong in request");
          console.log(err);
        },
      },
    );
    toggleOpenClose();

  };

  return (
    <div className="main">
      <button id="toggle" onClick={toggleOpenClose}>
        {isOpen ? "x" : '+'}

      </button>
      
      {isOpen ? (
        <div>
          <RequestForm onSubmit={handleRequestSubmit} />

        </div>
      ) : <RequestBoard/>}
    </div>
  );
};

//!SECTION

// SECTION Table Deconstructor / Reconstructor
// This is a helper for the table fetching
// deconstruct and reconstruct the table object from the blockchain
function getTableDate(data: SuiObjectData) {
  if (data.content?.dataType !== "moveObject") {
    throw new Error("Content not found");
  }
  const metadata = (data.content.fields as any).value.fields as { key: number , name: string, building: string, room: string, swipe: string, food: string, price: string};
  
  return { id: metadata.key,
          name: metadata.name,
          building: metadata.building,
          room: metadata.room,
          swipe: metadata.swipe,
          food: metadata.food,
          price: metadata.price,};
}
//!SECTION

export default Home;
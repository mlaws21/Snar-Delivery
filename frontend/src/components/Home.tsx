import React, { useState } from 'react';
import RequestForm from "./RequestForm";
import "./style/Home.css"

interface Request {
    name: string;
    building: string;
    room: string; 
    swipe: boolean;
    food: string;
    price: number;
    fulfilled: boolean

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
    name: 'John Doedjkahhfdjahfkdjahfkjahdfkjahdfkjahsdkfjhskjdhakjfhdkj',
    building: 'Main Building',
    room: '101',
    swipe: true,
    food: 'Pizza',
    price: 10,
    fulfilled: false,
  };

  const toggleOpenClose = () => {
    setIsOpen(!isOpen);
  };


  const handleRequestSubmit = (request: Request) => {
    // Do something with the submitted request
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
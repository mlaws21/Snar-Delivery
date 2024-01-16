import React, { useState } from 'react';
import RequestForm from "./RequestForm";

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
    

    return (
        <div>
        <p>Name: {request.name}</p>
        <p>Building: {request.building}</p>
        <p>Room: {request.room}</p>
        <p>Swipe: {request.swipe ? 'Yes' : 'No'}</p>
        <p>Food: {request.food}</p>
        <p>Price: {request.price}</p>
        <p>Fulfilled: {request.fulfilled ? 'Yes' : 'No'}</p>
        </div>
    )
}

interface MyComponentProps {
  // Define your component props here
}

const Form: React.FC<MyComponentProps> = ({ /* Destructure props if needed */ }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleOpenClose = () => {
    setIsOpen(!isOpen);
  };


  const handleRequestSubmit = (request: Request) => {
    // Do something with the submitted request
    console.log('Submitted Request:', request);
  };

  return (
    <div>
      <button onClick={toggleOpenClose}>
        {/* {isOpen ? 'Close' : 'Open'} Form */}
        {isOpen ? "x" : '+'}

      </button>
      
      {isOpen && (
        <div>
          {/* Content to display when the component is open */}
          <RequestForm onSubmit={handleRequestSubmit} />

        </div>
      )}
    </div>
  );
};



const Home = () => {
    const sampleRequest: Request = {
        name: 'John Doe',
        building: 'Main Building',
        room: '101',
        swipe: true,
        food: 'Pizza',
        price: 10,
        fulfilled: false,
      };


    return (
        <div>
            {/* <RequestComponent request={sampleRequest} /> */}
            <Form />
            {/* <RequestForm onSubmit={handleRequestSubmit} /> */}
        </div>
    )
}

export default Home
import React, { useState } from 'react';

interface Request {
  name: string;
  building: string;
  room: string;
  swipe: boolean;
  food: string;
  price: number;
  fulfilled: boolean;
}

interface RequestFormProps {
  onSubmit: (request: Request) => void;
}

const RequestForm: React.FC<RequestFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<Request>({
    name: '',
    building: '',
    room: '',
    swipe: false,
    food: '',
    price: 0,
    fulfilled: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
  
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </label>

      <label>
        Building:
        <input type="text" name="building" value={formData.building} onChange={handleChange} required />
      </label>

      <label>
        Room:
        <input type="text" name="room" value={formData.room} onChange={handleChange} required />
      </label>

      <label>
        Swipe:
        <input type="checkbox" name="swipe" checked={formData.swipe} onChange={handleChange} />
      </label>

      <label>
        Food:
        <input type="text" name="food" value={formData.food} onChange={handleChange} required />
      </label>

      <label>
        Price:
        <input type="number" name="price" value={formData.price} onChange={handleChange} required />
      </label>

      <label>
        Fulfilled:
        <input type="checkbox" name="fulfilled" checked={formData.fulfilled} onChange={handleChange} />
      </label>

      <button type="submit">Submit Request</button>
    </form>
  );
};

export default RequestForm;

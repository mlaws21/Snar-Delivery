import React, { useState } from 'react';
import "./style/RequestForm.css"

interface Request {
  id: number;
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
    id: 0,
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
        Paid:
        <input type="checkbox" className="checkmark" name="swipe" checked={formData.swipe} onChange={handleChange} />
      </label>

      <label>
        Food:
        <input type="text" name="food" value={formData.food} onChange={handleChange} required />
      </label>

      <label>
        Price:
        <input step="0.01" type="number" name="price" value={formData.price} onChange={handleChange} required />
      </label>



      <button type="submit">Submit Request</button>
    </form>
  );
};

export default RequestForm;

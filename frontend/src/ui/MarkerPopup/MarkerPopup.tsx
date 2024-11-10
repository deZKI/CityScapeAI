import React, { useState } from 'react';
import './markerpopup.css';

type TProps = {
  position: L.LatLngExpression;
  onSubmit: (data: FormData) => void;
};

type FormData = {
  name: string;
  description: string;
};

export default function MarkerPopup({ position, onSubmit }: TProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit(formData);
    setFormData({ name: '', description: '' });
  };

  return (
    <form className="marker-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Enter name"
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          placeholder="Enter description"
        />
      </div>
      <button type="submit">Save</button>
    </form>
  );
};
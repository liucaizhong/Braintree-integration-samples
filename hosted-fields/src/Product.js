import React from 'react';
import { Card } from 'antd';
import './Product.css';

const Product = ({ info }) => {
  // show the product information
  const { name, price, amount, desc } = info;

  return (
    <Card
      cover={
        <img
          alt="swing-man"
          src="https://i.pinimg.com/originals/b0/47/65/b047655e5cf486f9242ca403fd8076ac.jpg"
          style={{ objectFit: 'contain' }}
        />
      }
    >
      <Card.Meta
        title={
          <div className="product-info">
            <div>{name}</div>
            <div>
              <div>${price}</div>
              <div className="item-number">x{amount}</div>
            </div>
          </div>
        }
        description={desc}
      />
    </Card>
  );
};

export default Product;

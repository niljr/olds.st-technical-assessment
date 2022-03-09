import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import { formatDate, formatMoney } from './lib/index';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async() => {
    try {
      const result = await axios.get('http://localhost:8000/products?_page=10&_limit=10');
      setData(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='App'>
        <Container>
          <Row>
              <header>
                <h1>Products Grid</h1>
                <p>But first, a word from our sponsors:</p>
                <img
                  className='ad'
                  src={`http://localhost:8000/ads/?r=${Math.floor(Math.random()*1000)}`}
                  alt='ad'/>
              </header>
          </Row>
          <Row xs={1} md={4} className='g-4'>
            {Array.from(data).map(d => (
              <Col>
                <Card>
                  <Card.Header style={{ fontSize: `${d.size}px` }}>{d.face}</Card.Header>
                  <Card.Body>
                    <Card.Title>ID: {d.id}</Card.Title>
                    <Card.Text>Size: {d.size}</Card.Text>
                    <Card.Text>Price: {formatMoney(d.price)}</Card.Text>
                    <Card.Text>Date: {formatDate(d.date)}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
    </div>
  );
}

export default App;

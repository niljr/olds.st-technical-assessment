import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, ButtonGroup, Button, Alert } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import { formatDate, formatMoney, throttle } from './lib/index';

function App() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isEndofLine, setIsEndofLine] = useState(false);
  let count = 0;


  useEffect(() => {
    // window.addEventListener('scroll', throttle(fetchScrollDown, 2000));
    getData();
    window.addEventListener('scroll', fetchScrollDown);
    return () => window.removeEventListener('scroll', fetchScrollDown)
  }, [])

  useEffect(() => {
    if(!isFetching) return
    getData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching])

 
  const getData = async() => {
      try {
        setIsLoading(true);
  
        const result = await axios.get(`http://localhost:8000/products?_page=${currentPage}&_limit=15`);

        if (!result.data.length) { 
          setIsEndofLine(true);
          setIsFetching(false)
          return 
        }
        setData([...data, ...result.data]);

        let newPage = currentPage;
          newPage++;
          console.log(newPage)
          setCurrentPage(newPage);

        setIsFetching(false)
  
      } catch (error) {
        console.log(error)
      }
   
  }

  const sortData = async(sortType) => {
    try {
      setIsLoading(true)

      const result = await axios.get(`http://localhost:8000/products?_page=10&_limit=15&_sort=${sortType}`)

      setData(result.data)

      setIsLoading(false)
    } catch (error) {
      console.error(error)
    }
    // setData([...data].sort((a, b) => a[sortType] - b[sortType]));
  }

  const fetchScrollDown = async() => {
    const innetScrollTop = window.innerHeight + document.documentElement.scrollTop + 1;
    const offset = document.documentElement.offsetHeight 
    
    if (innetScrollTop >= offset && !isEndofLine) {
          setIsFetching(true)
    } else {
      return;
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
                  src={`http://localhost:8000/ads/?r=${Math.floor(Math.random()*10000)}`}
                  alt='ad'/>
              </header>
          </Row>

          <Row>
            <ButtonGroup style={{ margin: '20px 0px' }}>
              <Button variant="secondary" onClick={() => sortData ('size')}>Size</Button>
              <Button variant="secondary" onClick={() => sortData ('price')}>Price</Button>
              <Button variant="secondary" onClick={() => sortData ('id')}>ID</Button>
            </ButtonGroup>
          </Row>
        
          <Row xs={1} md={5} className='g-4'>
              {data.map(d => {
                  count++
                  return (
                    <>
                      {count % 20 === 0 ? 
                        <Col>
                        <Card>
                          <Card.Img variant='top' src={`http://localhost:8000/ads/?r=${Math.floor(Math.random()*1000+count)}`} />
                          <Card.Body>
                            <Card.Title>But first, A word from our sponsors</Card.Title>
                          </Card.Body>
                        </Card>
                      </Col>

                      : null}

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
                    </>
                  )
                })}
          </Row>
          <Row>
              {isLoading ? <Alert style={{ marginTop: 20 }} variant='primary'>{isEndofLine ? '~ end of catalogue ~': 'loading...'}</Alert> : null}
          </Row>
        </Container>
    </div>
  );
}

export default App;

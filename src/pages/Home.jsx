import { Container, Button, Card, Row, Col, Badge, Modal, Form } from "react-bootstrap";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import axios from 'axios';

function TopCard({ totalSold, totalRevenue }) {
    return (
        <Card className="shadow-sm mb-4 border-0 rounded" style={{ backgroundColor: "#f9f9fb" }}>
            <Card.Body>
                <Card.Title className="mb-3" style={{ color: "#4B0082", fontWeight: "600" }}>📦 Stocks Overview</Card.Title>
                <Row>
                    <Col md={6}>
                        <div
                            style={{
                                backgroundColor: "#6a0dad",
                                color: "white",
                                padding: "15px",
                                borderRadius: "10px",
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                textAlign: "center",
                                fontSize: "1.2rem",
                                fontWeight: "500",
                            }}
                        >
                            <h5>Total Items Sold</h5>
                            <span style={{ fontSize: "1.5rem", fontWeight: "600" }}>{totalSold}</span>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div
                            style={{
                                backgroundColor: "#28a745",
                                color: "white",
                                padding: "15px",
                                borderRadius: "10px",
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                textAlign: "center",
                                fontSize: "1.2rem",
                                fontWeight: "500",
                            }}
                        >
                            <h5>Total Revenue</h5>
                            <span style={{ fontSize: "1.5rem", fontWeight: "600" }}>₹{totalRevenue.toLocaleString()}</span>
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

const StockCardGrid = ({ stockDatas, handleSell }) => {
    return (
        <Row>
            {stockDatas.map((item) => (
                <Col key={item.productId} md={6} lg={4} className="mb-4">
                    <Card className="shadow-sm border-0 rounded-3 h-100" style={{ overflow: "hidden", backgroundColor: "#ffffff" }}>
                        <Card.Body className="d-flex flex-column justify-content-between p-4">
                            <div className="mb-3">
                                <h5 className="mb-1" style={{ fontWeight: 500, color: "#333" }}>{item.name}</h5>
                                <small style={{ color: "#555" }}>ID: {item.productId}</small>
                            </div>
                            <div className="mb-3">
                                <p className="mb-1" style={{ fontSize: "1.2rem", color: "#333" }}>
                                    <strong style={{ color: "#444" }}>Price:</strong>{" "}
                                    <span style={{ fontWeight: 600, color: "#6c757d" }}>₹{item.price}</span>
                                </p>
                                <p className="mb-1" style={{ fontSize: "1.2rem", color: "#333" }}>
                                    <strong style={{ color: "#444" }}>Revenue:</strong>{" "}
                                    <span style={{ fontWeight: 600, color: "#28a745" }}>₹{item.revenueGenerated.toLocaleString()}</span>
                                </p>
                            </div>
                            <div className="d-flex justify-content-between mb-3">
                                <Badge bg="light" text="dark" className="px-3 py-2" style={{ fontSize: "1rem" }}>
                                    Stock: {item.stockQuantity}
                                </Badge>
                                <Badge bg="light" text="dark" className="px-3 py-2" style={{ fontSize: "1rem" }}>
                                    Sold: {item.itemsSold}
                                </Badge>
                            </div>
                            <Button
                                variant="primary"
                                className="mt-auto w-100"
                                style={{
                                    backgroundColor: "#4c9bff",
                                    borderRadius: "0.5rem",
                                    fontWeight: 600,
                                    transition: "all 0.2s ease-in-out",
                                    border: "none",
                                    padding: "0.75rem"
                                }}
                                onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                                onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                                onClick={() => handleSell(item)}
                            >
                                Sell
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

function Home() {
    // const backEndAppUrl = import.meta.env.BACK_END_APP_URL;
    const backEndAppUrl = "https://stock-management-be-wq7x.onrender.com";

    const [stockDatas, setStockDatas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [sellingQuantity, setSellingQuantity] = useState(0);

    useEffect(() => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${backEndAppUrl}/api/stocks`,
            headers: {}
        };

        axios.request(config)
            .then((response) => {
                const rawData = response.data.data;

                const transformedData = rawData.map(item => ({
                    productId: item.productId,
                    name: item.product.name,
                    price: item.product.price,
                    stockQuantity: item.product.quantity,
                    itemsSold: item.itemsSold,
                    revenueGenerated: item.revenueGenerated
                }));

                console.log(transformedData);
                setStockDatas(transformedData);

            })
            .catch((error) => {
                console.log(error);
            });


    }, []);

    const handleSell = (item) => {
        setShowModal(true);
        setSelectedItem(item);
        console.log("Selling item:", item.name);
    };

    const handleClose = () => {
        setShowModal(false);
        setSellingQuantity(0);
        setSelectedItem(null);
    };

    const handleChange = (e) => {
        const value = parseInt(e.target.value, 10);
        setSellingQuantity(isNaN(value) ? 0 : value);
        console.log("Sell: ", sellingQuantity);
    }

    const handleSubmit = () => {
        let data = JSON.stringify({
            "productId": selectedItem.productId,
            "price": selectedItem.price,
            "sellingQuantity": sellingQuantity,
            "prevStockData": {
                "productId": selectedItem.productId,
                "stockQuantity": selectedItem.stockQuantity,
                "itemsSold": selectedItem.itemsSold,
                "revenueGenerated": selectedItem.revenueGenerated
            }
        });

        console.log("Data: ", data);
        let config = {
            method: 'put',
            maxBodyLength: Infinity,
            url: `${backEndAppUrl}/api/stock`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                setStockDatas((prev) =>
                    prev.map((item) =>
                        item.productId === selectedItem.productId
                            ? {
                                ...item,
                                stockQuantity: item.stockQuantity - sellingQuantity,
                                itemsSold: item.itemsSold + sellingQuantity,
                                revenueGenerated: item.revenueGenerated + (selectedItem.price * sellingQuantity),
                            }
                            : item
                    )
                );
            })
            .catch((error) => {
                console.log(error);
            });

        setShowModal(false);
        handleClose();

        console.log("Called");
    }

    const renderSellModal = (selectedItem) => (
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Sell Quantity</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {selectedItem && (
                    <>
                        <h5>Product: {selectedItem.name}</h5>
                        <p>Available Stock: {selectedItem.stockQuantity}</p>
                        <Form>
                            <Form.Group controlId="sellQuantity">
                                <Form.Label>Quantity to Sell</Form.Label>
                                <Form.Control
                                    name="sellingQuantity"
                                    type="number"
                                    placeholder="Enter quantity"
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Form>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose} >Cancel</Button>
                <Button variant="primary" onClick={handleSubmit} >Confirm Sell</Button>
            </Modal.Footer>
        </Modal>
    );

    const totalItemsSold = stockDatas.reduce((acc, item) => acc + item.itemsSold, 0);
    const totalRevenue = stockDatas.reduce((acc, item) => acc + item.revenueGenerated, 0);

    return (
        <Container style={{ backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
            <Header />
            <Container className="mt-4 px-3">
                <TopCard totalSold={totalItemsSold} totalRevenue={totalRevenue} />

                <Card className="shadow-sm border-0">
                    <Card.Body>
                        <StockCardGrid stockDatas={stockDatas} handleSell={handleSell} />
                    </Card.Body>
                </Card>

                {renderSellModal(selectedItem)}
            </Container>
        </Container>
    );
}

export default Home;

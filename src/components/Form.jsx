import { Modal, Button, Form as BootstrapForm } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Container } from "@mantine/core";

const Form = ({ show, onHide, initialData, onSubmit, mode }) => {
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        description: "",
        price: "",
        quantity: "",
        type: "",
        vendor: "",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                    id: initialData.id,
                    name: initialData.name,
                    description: initialData.description,
                    price: initialData.price,
                    quantity: initialData.quantity,
                    type: initialData.type,
                    vendor: initialData.vendor,
                });
        } else {
            setFormData({
                id: "",
                name: "",
                description: "",
                price: "",
                quantity: "",
                type: "",
                vendor: "",
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...formData });
    };

    return (

        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{mode === "edit" ? "Edit Product" : "Add Product"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <BootstrapForm onSubmit={handleSubmit}>
                    {Object.keys(formData).map((key) => (
                        <BootstrapForm.Group key={key} className="mb-3">
                            <BootstrapForm.Label>{key.toUpperCase()}</BootstrapForm.Label>
                            <BootstrapForm.Control
                                type="text"
                                name={key}
                                value={formData[key]}
                                onChange={handleChange}
                            />
                        </BootstrapForm.Group>
                    ))}
                    <Button type="submit" variant="primary">
                        {mode === "edit" ? "Update" : "Add"}
                    </Button>
                </BootstrapForm>
            </Modal.Body>
        </Modal>
    );
};

export default Form;
